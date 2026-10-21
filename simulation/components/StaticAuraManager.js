/**
 * StaticAuraManager
 *
 * Event-driven replacement for the polled range-manager query that Auras.js
 * creates for every range aura. It is only meant for auras flagged
 * "static": true in their JSON, i.e. auras whose source AND targets never move
 * (structures). The range manager re-runs every enabled query each turn;
 * this component instead works only when something relevant changes.
 *
 * It does not apply any modifier itself: it calls Auras.ApplyAura / RemoveAura
 * on the source, exactly like Auras.OnRangeUpdate does, so stacking, status
 * bar icons and modifiers behave the same.
 *
 * Work is deferred to OnUpdate (next simulation turn), which mirrors the
 * polled timing and avoids depending on the order in which position and
 * ownership are set when an entity is created.
 */
function StaticAuraManager() {}

StaticAuraManager.prototype.Schema =
	"<a:component type='system'/><empty/>";

StaticAuraManager.prototype.Init = function()
{
	// "<source>/<aura>" -> { "source": entity, "aura": auraName }
	this.registry = {};
	this.registryCount = 0;
	// Registry keys whose targets must be computed from scratch.
	this.pendingSources = [];
	// Entities that must be checked against every registered aura.
	this.pendingEntities = [];
};

StaticAuraManager.prototype.GetKey = function(source, aura)
{
	return source + "/" + aura;
};

/**
 * Called by Auras.Clean for a static aura that is applied.
 * Idempotent: Clean is re-run on ownership, diplomacy, tech and defeat changes.
 */
StaticAuraManager.prototype.Register = function(source, aura)
{
	let key = this.GetKey(source, aura);
	if (!this.registry[key])
		++this.registryCount;
	this.registry[key] = { "source": source, "aura": aura };
	if (this.pendingSources.indexOf(key) == -1)
		this.pendingSources.push(key);
};

/**
 * Called by Auras.Clean after it has removed the aura from its targets.
 */
StaticAuraManager.prototype.Unregister = function(source, aura)
{
	let key = this.GetKey(source, aura);
	if (!this.registry[key])
		return;
	delete this.registry[key];
	--this.registryCount;
	let idx = this.pendingSources.indexOf(key);
	if (idx != -1)
		this.pendingSources.splice(idx, 1);
};

/**
 * Covers creation (invalid -> player), destruction (player -> invalid) and
 * capture of any entity that may be an aura target.
 * A source's own change is handled by Auras.Clean (Unregister + Register).
 */
StaticAuraManager.prototype.OnGlobalOwnershipChanged = function(msg)
{
	if (!this.registryCount)
		return;
	if (this.pendingEntities.indexOf(msg.entity) == -1)
		this.pendingEntities.push(msg.entity);
};

StaticAuraManager.prototype.OnUpdate = function()
{
	if (!this.pendingSources.length && !this.pendingEntities.length)
		return;

	let sources = this.pendingSources;
	let entities = this.pendingEntities;
	this.pendingSources = [];
	this.pendingEntities = [];

	for (let key of sources)
		if (!this.ComputeSourceTargets(key))
			this.pendingSources.push(key);	// not in the world yet, retry next turn

	for (let ent of entities)
		this.RefreshEntity(ent);
};

/**
 * Find all current targets of a freshly registered aura with one query.
 * @return {boolean} false if the source is not in the world yet (retry later).
 */
StaticAuraManager.prototype.ComputeSourceTargets = function(key)
{
	let entry = this.registry[key];
	if (!entry)
		return true;

	let cmpAuras = Engine.QueryInterface(entry.source, IID_Auras);
	if (!cmpAuras)
		return true;

	let cmpPosition = Engine.QueryInterface(entry.source, IID_Position);
	if (!cmpPosition || !cmpPosition.IsInWorld())
		return false;

	let players = cmpAuras.GetAffectedPlayers(entry.aura);
	if (!players.length)
		return true;

	let cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
	// Same parameters as the polled query: no size accounting, Identity required.
	let found = cmpRangeManager.ExecuteQueryAroundPos(cmpPosition.GetPosition2D(), 0,
		cmpAuras.GetRange(entry.aura), players, IID_Identity, false);

	let current = cmpAuras.GetAffectedEntities(entry.aura);
	let toAdd = found.filter(ent => ent != entry.source && current.indexOf(ent) == -1);
	if (toAdd.length)
		cmpAuras.ApplyAura(entry.aura, toAdd);
	return true;
};

/**
 * Check one entity (new, captured or destroyed) against every registered aura.
 * Equivalent to the added/removed lists the polled query would have produced.
 */
StaticAuraManager.prototype.RefreshEntity = function(ent)
{
	let cmpIdentity = Engine.QueryInterface(ent, IID_Identity);
	let cmpPosition = Engine.QueryInterface(ent, IID_Position);
	let cmpOwnership = Engine.QueryInterface(ent, IID_Ownership);

	let owner = cmpOwnership ? cmpOwnership.GetOwner() : INVALID_PLAYER;
	let present = !!cmpIdentity && !!cmpPosition && cmpPosition.IsInWorld() && owner != INVALID_PLAYER;
	let classes = present ? cmpIdentity.GetClassesList() : null;
	let pos = present ? cmpPosition.GetPosition2D() : null;

	for (let key in this.registry)
	{
		let entry = this.registry[key];
		if (entry.source == ent)
			continue;

		let cmpAuras = Engine.QueryInterface(entry.source, IID_Auras);
		if (!cmpAuras)
			continue;	// source gone, its Clean already unregistered it

		let aura = entry.aura;
		let isTarget = cmpAuras.GetAffectedEntities(aura).indexOf(ent) != -1;

		let shouldApply = false;
		if (present && cmpAuras.GetAffectedPlayers(aura).indexOf(owner) != -1 &&
		    MatchesClassList(classes, cmpAuras.GetClasses(aura)))
		{
			let cmpSourcePosition = Engine.QueryInterface(entry.source, IID_Position);
			if (cmpSourcePosition && cmpSourcePosition.IsInWorld())
			{
				let range = cmpAuras.GetRange(aura);
				shouldApply = cmpSourcePosition.GetPosition2D().distanceToSquared(pos) <= range * range;
			}
		}

		if (shouldApply && !isTarget)
			cmpAuras.ApplyAura(aura, [ent]);
		else if (!shouldApply && isTarget)
		{
			if (cmpIdentity)
				cmpAuras.RemoveAura(aura, [ent]);
			else
				cmpAuras.RemoveGoneTarget(aura, ent);	// destroyed: RemoveAura would skip it
		}
	}
};

Engine.RegisterSystemComponentType(IID_StaticAuraManager, "StaticAuraManager", StaticAuraManager);
