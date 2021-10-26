const { Schema, model } = require('mongoose');

const taskSchema = Schema({
  stagesId: { type: Schema.ObjectId },
  name: {
    type: String,
  },
  changeStage: {
    type: Boolean,
  },
  viewCarrier: {
    type: Boolean,
  },
  viewClient: {
    type: Boolean,
  },
  allowFiles: {
    type: Boolean,
  },
  pushNotification: {
    type: Boolean,
  },
  emailNotification: {
    type: Boolean,
  },
  smsNotification: {
    type: Boolean,
  },
  validation: {
    operator: {
      type: Boolean,
    },
    carrier: {
      type: Boolean,
    },
    client: {
      type: Boolean,
    },
  },
  allow: {
    operator: {
      type: Boolean,
    },
    carrier: {
      type: Boolean,
    },
    client: {
      type: Boolean,
    },
  },
  action: [
    {
      dateAction: {
        type: Date,
      },
      userId: { type: Schema.ObjectId },
      Validation: {
        ifValidation: {
          type: Boolean,
        },
        approve: {
          type: Boolean,
        },
      },
      comment: {
        type: String,
      },
    },
  ],
  file: [
    {
      type: {
        type: String,
      },
      thumbnailPath: {
        type: String,
      },
      largePath: {
        type: String,
      },
      loadDate: {
        type: Date,
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

taskSchema.methods.toJSON = function () {
  const { __v, ...task } = this.toObject();
  return task;
};

module.exports = model('task', taskSchema);
