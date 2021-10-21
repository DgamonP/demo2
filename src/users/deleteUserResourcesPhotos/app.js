const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const moment = require('moment');
const { dbConnection } = require('./database/config');
const User = require('./models/user');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};
exports.lambdaHandler = async (event, context) => {
  try {
    await dbConnection(process.env.dataBaseConnection);
    console.log('event ==> ', event);
    const body = typeof event.body !== 'undefined' ? JSON.parse(event.body) : event;
    console.log('body ==> ', body);
    let dateTime = moment().format();
    const userId = event.pathParameters.userId;
    let type = body.type || '';
    let userNew;

    switch (type) {
      case 'pathPhoto':
        console.log('entro a pathPhoto');
        userNew = await User.findOneAndUpdate(
          { _id: userId },
          {
            $set: { 'profile.pathPhoto': '' },
          },
          { new: true }
        );
        break;
      case 'photoDocumentIdFront':
        console.log('entro a photoDocumentIdFront');
        userNew = await User.findOneAndUpdate(
          { _id: userId },
          {
            $set: { 'resources.photoDocumentIdFront': '' },
          },
          { new: true }
        );
        break;
      case 'photoDocumentIdReverse':
        console.log('entro a photoDocumentIdReverse');
        userNew = await User.findOneAndUpdate(
          { _id: userId },
          {
            $set: { 'resources.photoDocumentIdReverse': '' },
          },
          { new: true }
        );
        break;
      case 'photoLicenseDrivers':
        console.log('entro a photoLicenseDrivers');
        userNew = await User.findOneAndUpdate(
          { _id: userId },
          {
            $set: { 'resources.photoLicenseDrivers': '' },
          },
          { new: true }
        );
        break;
      default:
        break;
    }

    let percentage = 0;
    if (userNew.profile.firstName) percentage++;
    if (userNew.profile.lastName) percentage++;
    if (userNew.profile.documentId) percentage++;
    if (userNew.profile.birthDate) percentage++;
    if (userNew.profile.pathPhoto) percentage++;
    if (userNew.profile.personReference) percentage++;
    if (userNew.profile.phoneReference) percentage++;

    if (userNew.address) {
      if (userNew.address.country) percentage++;
      if (userNew.address.city) percentage++;
      if (userNew.address.states) percentage++;
      if (userNew.address.street) percentage++;
    }

    if (userNew.resources) {
      if (userNew.resources.photoDocumentIdFront) percentage++;
      if (userNew.resources.photoDocumentIdReverse) percentage++;
      if (userNew.resources.photoLicenseDrivers) percentage++;
    }

    percentage = percentage / 14;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Recurso eliminado',
        user: { ...userNew._doc, advancePercentage: percentage },
      }),
    };
  } catch (err) {
    console.log('err =>', err);
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        message: 'Error',
        // error: err,
      }),
    };
  }
  return;
};
