const { Schema, model } = require('mongoose');

const travelSchema = Schema({
  travelId: { type: Schema.ObjectId },
  operationId: { type: Schema.ObjectId },
  initialTravel: { type: Schema.ObjectId },
  quantityTransportUnit: {
    type: Number,
  },
  comment: {
    type: String,
  },
  travelFms: {
    type: Boolean,
    default: false,
  },
  companyFmsId: { type: Schema.ObjectId },
  linkApp: {
    type: String,
  },
  route: {
    origin: {
      cityOriginId: { type: Schema.ObjectId },
      cityOrigin: {
        type: String,
      },
      direction: {
        type: String,
      },
    },
    destination: {
      cityDestinationId: { type: Schema.ObjectId },
      cityDestination: {
        type: String,
      },
      directionDestination: {
        type: String,
      },
    },
    checkPoints: [
      {
        lat: {
          type: Number,
        },
        lng: {
          type: Number,
        },
        name: {
          type: String,
        },
        km: {
          type: Number,
        },
        type: {
          type: String,
        },
      },
    ],
  },
  typeTransportUnitLabel: {
    type: String,
  },
  publish: {
    type: Boolean,
  },
  travelstatus: [
    {
      statusId: { type: Schema.ObjectId },
      name: {
        type: String,
      },
      date: {
        type: Date,
      },
      order: {
        type: Number,
      },
    },
  ],
  dates: {
    indefiniteDate: {
      type: Boolean,
      default: false,
    },
    publishDate: {
      type: Date,
    },
    loadingDate: {
      type: Date,
    },
    deliveryDate: {
      type: Date,
    },
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
  volumeUnit: {
    volumeUnitId: { type: Schema.ObjectId },
    name: {
      type: String,
    },
    abbreviation: {
      type: String,
    },
    value: {
      type: Number,
    },
  },
  weightUnit: {
    weightUnitId: { type: Schema.ObjectId },
    name: {
      type: String,
    },
    abbreviation: {
      type: String,
    },
    value: {
      type: Number,
    },
  },
  categoryLoad: {
    categoryLoadId: { type: Schema.ObjectId },
    name: {
      type: String,
    },
  },
  boardingMode: {
    boardingModeId: { type: Schema.ObjectId },
    name: {
      type: String,
    },
  },
  freightValues: {
    clientFreight: {
      typeCurrencyFreightId: { type: Schema.ObjectId },
      freightValue: {
        type: Number,
      },
      marginGain: {
        type: Number,
      },
      invoice: {
        type: Boolean,
      },
    },
    freightOffered: {
      typeCurrencyOfferedId: { type: Schema.ObjectId },
      invoice: {
        type: Boolean,
      },
      value: {
        type: Number,
      },
    },
  },
  loadingOrder: {
    loadingOrderId: { type: Schema.ObjectId },
    packaging: {
      type: String,
    },
    carrierFreight: {
      typeCurrencyFreightId: {
        type: String,
      },
      freightValue: {
        type: Number,
      },
      invoice: {
        type: Boolean,
      },
    },
    datesDone: {
      loadingDate: {
        type: Date,
      },
      deliveryDate: {
        type: Date,
      },
    },
    originDone: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    destinationDone: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    assignment: {
      assignmentStatus: {
        type: Number,
      },
      transportUnitId: { type: Schema.ObjectId },
    },
    LoadingOrderStatus: [
      {
        statusId: { type: Schema.ObjectId },
        name: {
          type: String,
        },
        date: {
          type: Date,
        },
        order: {
          type: Number,
        },
      },
    ],
    distanceTraveled: {
      distanceTraveledId: { type: Schema.ObjectId },
      name: {
        type: String,
      },
      abbreviation: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
    weightUnit: {
      weightUnitId: { type: Schema.ObjectId },
      name: {
        type: String,
      },
      abbreviation: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
    VolumeUnit: {
      VolumeUnitId: { type: Schema.ObjectId },
      name: {
        type: String,
      },
      abbreviation: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
  },
  distanceTravel: {
    name: {
      type: String,
    },
    value: {
      type: Number,
    },
  },
  row: {
    createDate: {
      type: Date,
      default: Date.now,
    },
    createOperatorId: { type: Schema.ObjectId },
    updateDate: {
      type: Date,
    },
    updateOperatorId: { type: Schema.ObjectId },
    disableDate: {
      type: Date,
    },
    disableOperatorId: { type: Schema.ObjectId },
  },
});

travelSchema.methods.toJSON = function () {
  const { __v, ...travel } = this.toObject();
  return travel;
};

module.exports = model('travel', travelSchema);
