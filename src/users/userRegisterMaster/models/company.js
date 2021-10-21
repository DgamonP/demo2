const { Schema, model } = require('mongoose');

const companySchema = Schema({
  name: {
    type: String,
  },
  prefix: {
    type: String,
  },
  taxId: {
    type: String,
  },
  adress: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  public: {
    type: Boolean,
  },
  fms: {
    type: Boolean,
    default: false,
  },
  self: {
    type: Boolean,
    default: false,
  },
  access: [
    {
      modulesId: { type: Schema.ObjectId },
      name: {
        type: String,
      },
      code: {
        type: String,
      },
      read: {
        type: Boolean,
      },
      write: {
        type: Boolean,
      },
    },
  ],
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

companySchema.methods.toJSON = function () {
  const { __v, ...company } = this.toObject();
  return company;
};

module.exports = model('company', companySchema);
