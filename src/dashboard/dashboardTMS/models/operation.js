const { Schema, model } = require('mongoose');

const operationSchema = Schema({
  code: {
    type: String,
  },
  description: {
    type: String,
  },
  comment: {
    type: String,
  },
  statusOperationId: { type: Schema.ObjectId },
  usersClients: [
    {
      userClientId: { type: Schema.ObjectId },
      fullName: {
        type: String,
      },
    },
  ],
  companyClientId: { type: Schema.ObjectId },
  userOperatorId: { type: Schema.ObjectId },
  companyOperatorId: { type: Schema.ObjectId },
  userOperatorAccess: [
    {
      userOperatorId: { type: Schema.ObjectId },
    },
  ],
  typeService: {
    typeServiceId: { type: Schema.ObjectId },
    name: {
      type: String,
    },
  },
  dispatchType: {
    dispatchTypeId: { type: Schema.ObjectId },
    dispatch: {
      type: String,
    },
  },
  placeRoute: {
    placeId: { type: Schema.ObjectId },
    countryName: {
      type: String,
    },
  },
  rating: {
    value: {
      type: Number,
    },
    ratingComment: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  companiesFms: [
    {
      companyId: { type: Schema.ObjectId },
      name: {
        type: String,
      },
    },
  ],
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

operationSchema.methods.toJSON = function () {
  const { __v, ...operation } = this.toObject();
  return operation;
};

module.exports = model('operation', operationSchema);
