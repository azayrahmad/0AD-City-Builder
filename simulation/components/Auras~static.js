/**
 * Overlay for Auras.js (A24b): range auras flagged "static": true in their JSON
 * are handed to the StaticAuraManager instead of creating a polled range query.
 *
 * Everything else is unchanged. If the manager is not present, static auras
 * silently fall back to the normal polled query.
 *
 * Only flag auras whose source and affected entities never move (structures).
 */

Auras.prototype.IsStaticAura = function(name)
{
	return this.IsRangeAura(name) && !!AuraTemplates.Get(name).static;
};

/**
 * Remove an aura from a target that no longer exists (destroyed).
 * RemoveAura cannot be used: it skips entities without an Identity component,
 * and the ModifiersManager does not clean up destroyed entities by itself.
 */
Auras.prototype.RemoveGoneTarget = function(name, ent)
{
	if (!this[name] || !this[name].targetUnits || this[name].targetUnits.indexOf(ent) == -1)
		return;

	this[name].targetUnits = this[name].targetUnits.filter(e => e != ent);

	if (!this[name].isApplied || this.IsGlobalAura(name))
		return;

	let cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);
	let derivedModifiers = DeriveModificationsFromTech({
		"modifications": this.GetModifications(name),
		"affects": this.GetClasses(name)
	});
	let modifName = this.GetModifierIdentifier(name);
	for (let modifierPath in derivedModifiers)
		cmpModifiersManager.RemoveModifier(modifierPath, modifName, ent);
};

/**
 * clean all bonuses. Remove the old ones and re-apply the new ones
 * (copy of the A24b function; the lines that differ are marked STATIC).
 */
Auras.prototype.Clean = function()
{
	var cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
	// STATIC
	let cmpStaticAuraManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_StaticAuraManager);
	var auraNames = this.GetAuraNames();
	let targetUnitsClone = {};
	let needVisualizationUpdate = false;
	// remove all bonuses
	for (let name of auraNames)
	{
		targetUnitsClone[name] = [];
		if (!this[name])
			continue;

		if (this.IsRangeAura(name))
			needVisualizationUpdate = true;

		if (this[name].targetUnits)
			targetUnitsClone[name] = this[name].targetUnits.slice();

		if (this.IsGlobalAura(name))
			this.RemoveTemplateAura(name);

		this.RemoveAura(name, this[name].targetUnits);

		// STATIC
		if (cmpStaticAuraManager && this.IsStaticAura(name))
			cmpStaticAuraManager.Unregister(this.entity, name);

		if (this[name].rangeQuery)
			cmpRangeManager.DestroyActiveQuery(this[name].rangeQuery);
	}

	for (let name of auraNames)
	{
		// only calculate the affected players on re-applying the bonuses
		// this makes sure the template bonuses are removed from the correct players
		this.CalculateAffectedPlayers(name);
		// initialise range query
		this[name] = {};
		this[name].targetUnits = [];
		this[name].isApplied = this.CanApply(name);
		var affectedPlayers = this.GetAffectedPlayers(name);

		if (!affectedPlayers.length)
			continue;

		if (this.IsGlobalAura(name))
		{
			this.ApplyTemplateAura(name, affectedPlayers);
			// Only need to call ApplyAura for the aura icons, so skip it if there are none.
			if (this.GetOverlayIcon(name))
				for (let player of affectedPlayers)
					this.ApplyAura(name, cmpRangeManager.GetEntitiesByPlayer(player));
			continue;
		}

		if (this.IsPlayerAura(name))
		{
			let cmpPlayerManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);
			this.ApplyAura(name, affectedPlayers.map(p => cmpPlayerManager.GetPlayerByID(p)));
			continue;
		}

		if (!this.IsRangeAura(name))
		{
			this.ApplyAura(name, targetUnitsClone[name]);
			continue;
		}

		needVisualizationUpdate = true;

		if (this[name].isApplied && (this.IsRangeAura(name) || this.IsGlobalAura(name) && !!this.GetOverlayIcon(name)))
		{
			// STATIC: event-driven path, no polled query.
			if (cmpStaticAuraManager && this.IsStaticAura(name))
			{
				cmpStaticAuraManager.Register(this.entity, name);
				continue;
			}

			// Do not account for entity sizes: structures can have various sizes
			// and we currently prefer auras to not depend on the source size
			// (this is generally irrelevant for units).
			this[name].rangeQuery = cmpRangeManager.CreateActiveQuery(
				this.entity,
				0,
				this.GetRange(name),
				affectedPlayers,
				IID_Identity,
				cmpRangeManager.GetEntityFlagMask("normal"),
				false
			);
			cmpRangeManager.EnableActiveQuery(this[name].rangeQuery);
		}
	}

	if (needVisualizationUpdate)
	{
		let cmpRangeOverlayManager = Engine.QueryInterface(this.entity, IID_RangeOverlayManager);
		if (cmpRangeOverlayManager)
		{
			cmpRangeOverlayManager.UpdateRangeOverlays("Auras");
			cmpRangeOverlayManager.RegenerateRangeOverlays(false);
		}
	}
};
