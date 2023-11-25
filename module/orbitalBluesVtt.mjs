// Import data model
import CharacterData from './data-models/orbitalBluesCharacterDataModel.mjs'
import VehicleData from './data-models/orbitalBluesVehicleDataModel.mjs'
import NpcData from './data-models/orbitalBluesNpcDataModel.mjs'
// Import constants
import ORBITALBLUES from './constants.mjs';
// Import document classes.
import OrbitalBluesActor from './documents/actor.mjs';
import OrbitalBluesItem from './documents/item.mjs';
// Import sheet classes.
import OrbitalBluesActorSheet from './sheets/actor-sheet.mjs';
import OrbitalBluesItemSheet from './sheets/item-sheet.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  console.log('Orbital Blues | Initializing')

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.orbitalblues = {
    OrbitalBluesActor,
    OrbitalBluesItem
  };

  // Add custom constants for configuration.
  CONFIG.ORBITALBLUES = ORBITALBLUES;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '1d3 + @stats.savvy.value + @stats.initiativeModifier',
    decimals: 0
  };

  // Register the Data Model
  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.Actor.dataModels.vehicle = VehicleData;
  CONFIG.Actor.dataModels.npc = NpcData;

  // Define custom Document classes
  CONFIG.Actor.documentClass = OrbitalBluesActor;
  CONFIG.Item.documentClass = OrbitalBluesItem;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('orbitalblues', OrbitalBluesActorSheet, { makeDefault: true });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('orbitalblues', OrbitalBluesItemSheet, { makeDefault: true });

});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('json', (context) => {
  return JSON.stringify(context, null, 4);
});

Handlebars.registerHelper('log', (context) => {
  return console.log(context);
});

Handlebars.registerHelper('titleCase', (txt) => {
  return txt.toLowerCase().split(' ').map((word) => {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});
