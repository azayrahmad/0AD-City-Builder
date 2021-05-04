/**
 * @param {number} amount The amount of resources that should be taken from the resource supply. The amount must be positive.
 * @return {{ "amount": number, "exhausted": boolean }} The current resource amount in the entity and whether it's exhausted or not.
 */
ResourceSupply.prototype.TakeResources = function(amount)
{
	// Before changing the amount, activate Fogging if necessary to hide changes
	let cmpFogging = Engine.QueryInterface(this.entity, IID_Fogging);
	if (cmpFogging)
		cmpFogging.Activate();

	if (this.IsInfinite())
		return { "amount": amount, "exhausted": false };

	let oldAmount = this.GetCurrentAmount();
	this.amount = Math.max(0, oldAmount - amount);

	let isExhausted = this.GetCurrentAmount() == 0;
	// Remove entities that have been exhausted
	if (isExhausted)
	{	
		if (this.template.Type == "food.grain")
			this.CreateFieldFoundation();
		Engine.DestroyEntity(this.entity);
	}

	Engine.PostMessage(this.entity, MT_ResourceSupplyChanged, { "from": oldAmount, "to": this.GetCurrentAmount() });

	return { "amount": oldAmount - this.GetCurrentAmount(), "exhausted": isExhausted };
};


ResourceSupply.prototype.CreateFieldFoundation = function()
{
	let cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
	if (!cmpPosition.IsInWorld())
		return INVALID_ENTITY;

	// Create foundation entity based on existing entity
	let templateName = Engine.QueryInterface(SYSTEM_ENTITY, IID_TemplateManager).GetCurrentTemplateName(this.entity);
	let spawnedEntity = Engine.AddEntity("foundation|" + templateName);

	// Move to same position
	let cmpSpawnedPosition = Engine.QueryInterface(spawnedEntity, IID_Position);
	let pos = cmpPosition.GetPosition();
	cmpSpawnedPosition.JumpTo(pos.x, pos.z);
	let rot = cmpPosition.GetRotation();
	cmpSpawnedPosition.SetYRotation(rot.y);
	cmpSpawnedPosition.SetXZRotation(rot.x, rot.z);

	// Set ownership
	let cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	let cmpSpawnedOwnership = Engine.QueryInterface(spawnedEntity, IID_Ownership);
	if (cmpOwnership && cmpSpawnedOwnership)
		cmpSpawnedOwnership.SetOwner(cmpOwnership.GetOwner());

	// Check if there is sufficient resource
	let cmpCost = Engine.QueryInterface(spawnedEntity, IID_Cost);
	let costs = cmpCost.GetResourceCosts();

	let cmpPlayer = QueryOwnerInterface(spawnedEntity);
	if (!cmpPlayer.TrySubtractResources(costs))
	{
		Engine.DestroyEntity(spawnedEntity);
		cmpSpawnedPosition.MoveOutOfWorld();
		return;
	}

	var cmpFoundation = Engine.QueryInterface(spawnedEntity, IID_Foundation);
	cmpFoundation.InitialiseConstruction(cmpSpawnedOwnership.GetOwner(), templateName);

	return spawnedEntity;
};

Engine.ReRegisterComponentType(IID_ResourceSupply, "ResourceSupply", ResourceSupply);
