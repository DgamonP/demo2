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

    let user = await User.findOneAndUpdate(
      { userId: userId },
      {
        $set: { profile: body.profile, address: body.address, 'account.updateDate': dateTime },
      },
      { new: true }
    );
    let percentage = 0;
    if (user?.profile?.firstName) percentage++;
    if (user?.profile?.lastName) percentage++;
    if (user?.profile?.documentId) percentage++;
    if (user?.profile?.birthDate) percentage++;
    if (user?.profile?.pathPhoto) percentage++;
    if (user?.profile?.personReference) percentage++;
    if (user?.profile?.phoneReference) percentage++;

    if (user?.address) {
      if (user?.address?.country) percentage++;
      if (user?.address?.city) percentage++;
      if (user?.address?.states) percentage++;
      if (user?.address?.street) percentage++;
    }

    if (user.resources) {
      if (user.resources.photoDocumentIdFront) percentage++;
      if (user.resources.photoDocumentIdReverse) percentage++;
      if (user.resources.photoLicenseDrivers) percentage++;
    }

    percentage = percentage / 14;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Usuario actualizado',
        user: { ...user._doc, advancePercentage: percentage },
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
};
