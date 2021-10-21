const { Schema, model } = require('mongoose');

const featuresTransportUnitSchema = Schema({
  name: {
    type: String,
  },
  path: {
    type: String,
  },
  Quantitative: {
    type: Boolean,
  },
  Qualitative: {
    type: Boolean,
  },
  values: [
    {
      valueQuantitative: {
        type: Number,
      },
      valueQualitative: {
        type: String,
      },
    },
  ],
  requireForCarrier: {
    type: Boolean,
  },
  account: {
    enable: {
      type: Boolean,
      default: true,
    },
    enableDate: {
      type: Date,
    },
    disableDate: {
      type: Date,
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
    updateDate: {
      type: Date,
    },
  },
});

featuresTransportUnitSchema.methods.toJSON = function () {
  const { __v, ...featuresTransportUnit } = this.toObject();
  return featuresTransportUnit;
};

module.exports = model('featuresTransportUnit', featuresTransportUnitSchema);
