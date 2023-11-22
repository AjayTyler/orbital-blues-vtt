import ORBITALBLUES from "../constants.mjs";

export default class NpcData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      notes: new fields.HTMLField(),
      loyalty: new fields.StringField(),
      npcType: new fields.StringField({
        required: true,
        initial: 'goon',
        nullable: false,
        choices: ORBITALBLUES.NPCTYPES
      }),
      isMark: new fields.BooleanField({
        required: false,
        nullable: true,
        initial: false
      }),

      stats: new fields.SchemaField({
        muscle: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),
        savvy: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),
        grit: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),
        heart: new fields.NumberField({
          required: false,
          nullable: true,
          integer: true,
          initial: 0
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
