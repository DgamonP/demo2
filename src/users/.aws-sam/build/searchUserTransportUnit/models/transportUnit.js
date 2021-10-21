const { Schema, model } = require('mongoose');

const transportUnitSchema = Schema({
  plate: {
    type: String,
  },
  owner: [
    {
      companyId: { type: Schema.ObjectId },
      userId: { type: Schema.ObjectId },
      assignationDate: {
        type: Date,
      },
      disengagement: {
        type: Date,
      },
      active: {
        type: Boolean,
      },
    },
  ],
  country: {
    type: String,
  },
  color: {
    type: String,
  },
  year: {
    type: String,
  },
  typeTransportUnit: {
    type: String,
  },
  brandId: { type: Schema.ObjectId },
  brand: {
    type: String,
  },
  features: [
    {
      featuresTransportUnitId: { type: Schema.ObjectId },
      name: {
        type: String,
      },
      valueQuantitative: {
        type: Number,
      },
      valueQualitative: {
        type: String,
      },
    },
  ],
  engine: {
    engine: {
      type: String,
    },
    fuelType: {
      type: String,
    },
  },
  drivers: [
    {
      userId: { type: Schema.ObjectId },
      assignationDate: {
        type: Date,
      },
      active: {
        type: Boolean,
      },
      ratings: [
        {
          loadingOrderId: { type: Schema.ObjectId },
          value: {
            type: Number,
          },
          comment: {
            type: String,
          },
          date: {
            type: Date,
          },
          userId: { type: Schema.ObjectId },
        },
      ],
    },
  ],
  resources: {
    photo: [
      {
        path: {
          type: String,
        },
      },
    ],
    photoRuat: {
      type: String,
    },
  },
  row: {
    createDate: {
      type: Date,
      default: Date.now,
    },
    updateDate: {
      type: Date,
    },
    disableDate: {
      type: Date,
    },
  },
});

transportUnitSchema.methods.toJSON = function () {
  const { __v, ...transportUnit } = this.toObject();
  return transportUnit;
};

module.exports = model('transportUnit', transportUnitSchema);
