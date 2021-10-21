const { Schema, model } = require('mongoose');

const vipDriversSchema = Schema({
  phone: {
    type: String,
  },
  companyId: { type: Schema.ObjectId },
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

vipDriversSchema.methods.toJSON = function () {
  const { __v, ...vipDrivers } = this.toObject();
  return vipDrivers;
};

module.exports = model('vipDrivers', vipDriversSchema);
