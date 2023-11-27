/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export default class OrbitalBluesActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {

    const default_dimensions = {
      character: {width: 670, height: 700},
      vehicle: {width: 300, height: 400}
    }

    return mergeObject(super.defaultOptions, {
      classes: ['ob', 'sheet', 'actor'],
      width: 670,
      height: 700
    });
  }

  /** @override */
  get template() {
    return `systems/orbital-blues-vtt/templates/${this.actor.type}-sheet.hbs`;
  }

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.system for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Add our constants for dropdown options etc.
    context.ORBITALBLUES = CONFIG.ORBITALBLUES;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      // this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();
    context.system.enrichedEquipment = await TextEditor.enrichHTML(context.rollData.equipment)

    // Prepare active effects
    // context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  // _prepareCharacterData(context) {
  //   // Translate ability scores for localization.
  //   for (let [k, v] of Object.entries(context.system.abilities)) {
  //     v.label = game.i18n.localize(CONFIG.BOILERPLATE.abilities[k]) ?? k;
  //   }
  // }

    /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const gambits = [];
    const troubles = [];

    for (let i of context.items) {
      // Populate gambits
      if (i.type === 'gambit') {
        context.system.gambits.push(i)
      }
      // Populate troubles
      if (i.type === 'trouble') {
        troubles.push(i)
        context.system.troubles.push(i)
      }
    }

    // Assign and return
    context.gambits = gambits;
    context.troubles = troubles;
  }

  /* -------------------------------------------- */
  /*                 Sheet Events                 */
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {

      const rollData = this.actor.getRollData();

      const rollFormula = (
        () => {
          if (dataset.combatRoll) {
            return rollData.combatRollFormula;
          } else if (dataset.label == 'Initiative') {
            return dataset.roll;
          } else {
            return rollData.taskRollFormula + '+' + dataset.roll;
          }
        }
      )()

      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(rollFormula, rollData);
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

}
