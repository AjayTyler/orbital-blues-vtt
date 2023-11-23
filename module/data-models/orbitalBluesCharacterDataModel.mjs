import ORBITALBLUES from "../constants.mjs";

export default class CharacterData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      biography: new fields.HTMLField(),
      equipment: new fields.HTMLField(),

      stats: new fields.SchemaField({
        heart: new fields.NumberField({
          required: true,
          initial: 8,
          integer: true
        }),
        blues: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),
        muscle: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),
        grit: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),
        savvy: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true
        }),

        situation: new fields.StringField({
          required: true,
          nullable: false,
          choices: ORBITALBLUES.SITUATIONS,
          initial: 'normal'
        })
      }),

      initiativeModifier: new fields.NumberField({
        required: false,
        initial: 0,
        integer: true
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
      }),

      credits: new fields.NumberField({required: true, initial: 0, integer: true}),
      debts: new fields.NumberField({required: true, initial: 0, integer: true}),

      gambits: new fields.HTMLField(),
      troubles: new fields.HTMLField()

    }
  }
}
