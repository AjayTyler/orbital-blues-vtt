import ORBITALBLUES from "../constants.mjs";

export default class VehicleData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      notes: new fields.HTMLField(),

      stats: new fields.SchemaField({
        body: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),
        mobility: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),
        systems: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),

        size: new fields.StringField({
          required: true,
          nullable: false,
          initial: 'medium',
          choices: ORBITALBLUES.SHIPSIZES
        }),

        situation: new fields.StringField({
          required: true,
          nullable: false,
          choices: ORBITALBLUES.SITUATIONS,
          initial: 'normal'
        })
      }),

      taskRollFormula: new fields.StringField({
        required: true,
        nullable: false,
        initial: '2d6'
      }),
      combatRollFormula: new fields.StringField({
        required: true,
        nullable: false,
        initial: '3d6'
      })
    }
  }
}
