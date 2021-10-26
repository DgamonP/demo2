const { Schema, model } = require('mongoose');

const operationStatusSchema = Schema({
  name: {
    type: String,
  },
  order: {
    type: Number,
  },
});

operationStatusSchema.methods.toJSON = function () {
  const { __v, ...operationStatus } = this.toObject();
  return operationStatus;
};

module.exports = model('operationStatus', operationStatusSchema);
