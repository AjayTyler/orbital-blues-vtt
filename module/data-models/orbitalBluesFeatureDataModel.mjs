import ORBITALBLUES from '../constants.mjs';

export default class BackgroundTypeDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      featureType: new fields.StringField({
        required: true,
        initial: 'gambit',
        choices: ORBITALBLUES.FEATURETYPES
      })
    }
  }
}
