import ORBITALBLUES from '../constants.mjs';

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for our system.
 * @extends {Actor}
 */
export class OrbitalBluesActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

    /** @override */
    prepareBaseData() {
      // Data modifications in this step occur before processing embedded
      // documents or derived data.
    }
  
  /**
   * @override
   * If needed, we can bring in the prepareDerivedData() function
   * from the example. However, I don't think we'll need it.
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    // this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    // if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // console.log(systemData)
    // console.log(ORBITALBLUES.SKILLROLL)

    systemData.taskRollFormula = ORBITALBLUES.SKILLROLL[systemData.stats.situation].value;
    systemData.combatRollFormula = ORBITALBLUES.COMBATROLL[systemData.stats.situation].value;
    systemData.isMark = actorData.type == 'npc' ? actorData.system.npcType == 'mark' : false;

  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // Be forewarned: I was tired when annotating, so might be off a bit.
    // This gets the system data we defined in template.json.
    // Look at Fountry Virtual Tabletop > resources > app > common > documents > actor.mjs
    // to see the parameter we're using: system.
    // Look at resources > app > client > data > documents > actor.js
    // to see what this super is all about.
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.stats) {
      for (let [k, v] of Object.entries(data.stats)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }

  // TODO: add other Actor types, like ship and whatnot

}
