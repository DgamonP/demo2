const { Schema, model } = require('mongoose');

const ratingSchema = Schema({
  travelId: { type: Schema.ObjectId },
  userId: { type: Schema.ObjectId },
  value: {
    type: Number,
  },
  commentary: {
    type: String,
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

ratingSchema.methods.toJSON = function () {
  const { __v, ...rating } = this.toObject();
  return rating;
};

module.exports = model('rating', ratingSchema);
