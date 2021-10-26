const { Schema, model } = require('mongoose');

const stagesSchema = Schema({
  name: {
    type: String,
  },
  loadingOrderId: { type: Schema.ObjectId },
  active: {
    type: Number,
  },
  order: {
    type: Number,
  },
  rating: {
    value: {
      type: Number,
    },
    commentRating: {
      type: {
        type: String,
      },
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

stagesSchema.methods.toJSON = function () {
  const { __v, ...stages } = this.toObject();
  return stages;
};

module.exports = model('stages', stagesSchema);
