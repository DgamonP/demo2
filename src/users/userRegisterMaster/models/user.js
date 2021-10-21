const { ObjectId } = require('bson');
const { Schema, model } = require('mongoose');

const userSchema = Schema({
  userId: {
    type: String,
    require: [true, 'el userId es requerido'],
  },
  type: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
  auth: {
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    countryCode: {
      type: String,
    },
    tokenSession: {
      type: String,
    },
  },
  recordAdvance: [Number],
  device: {
    pushToken: {
      type: String,
    },
    phone: {
      type: String,
    },
    registerDate: {
      type: Date,
    },
    lastAccessDate: {
      type: Date,
    },
    countryCode: {
      type: String,
    },
  },
  profile: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    documentId: {
      type: String,
    },
    taxId: {
      type: String,
    },
    pathPhoto: {
      type: String,
    },
    companyId: { type: Schema.ObjectId },
    birthDate: {
      type: Date,
    },
    timeZone: {
      type: String,
      default: 'America/La_Paz',
    },
    personReference: {
      type: String,
    },
    phoneReference: {
      type: String,
    },
  },
  address: {
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    states: {
      type: String,
    },
    street: {
      type: String,
    },
    postalCode: {
      type: String,
    },
  },
  roles: [
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
  resources: {
    photoDocumentIdFront: {
      type: String,
    },
    photoDocumentIdReverse: {
      type: String,
    },
    photoLicenseDrivers: {
      type: String,
    },
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

userSchema.methods.toJSON = function () {
  const { __v, ...user } = this.toObject();
  return user;
};

module.exports = model('user', userSchema);
