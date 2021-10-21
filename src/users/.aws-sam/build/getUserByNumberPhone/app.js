const AWS = require('aws-sdk');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2017-05-30',
});

const { dbConnection } = require('./database/config');
const User = require('./models/user');
const VipDrivers = require('./models/vipDrivers');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};
// const UserPoolId = 'us-east-1_7JlBMUgy1';
const UserPoolId = process?.env?.IdGrupoCognitoCarrier || '';
exports.lambdaHandler = async (event, context) => {
  try {
    await dbConnection(process.env.dataBaseConnection);
    const numberPhone = event?.pathParameters?.phone || '';
    const vipDriver = await VipDrivers.findOne({ phone: numberPhone, 'account.enable': true });
    // const user = await User.findOne({ 'auth.phone': numberPhone });
    let isSpecial = false;
    if (!vipDriver) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          isSpecial,
        }),
      };
    }

    const userCognito = await User.findOne({ 'auth.phone': numberPhone, type: 'Carrier' });
    let confirmed = userCognito?.auth?.confirmed || false;
    if (confirmed) {
      isSpecial = true;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          isSpecial,
        }),
      };
    }
    const userCognitoId = userCognito?.userId || '';
    let params = {
      UserAttributes: [
        {
          Name: 'phone_number_verified',
          Value: 'true',
        },
      ],
      Username: userCognitoId,
      UserPoolId: UserPoolId,
    };
    console.log('params===>>>', params);

    const newUserCognito = await new Promise((resolve, reject) => {
      cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function (err, data) {
        if (err) {
          console.log('ERR ==>', err);
          reject({ ok: false, error: { err } });
        } else {
          console.log('DATA ==>', data);
          resolve({ ok: true, ...data });
        }
      });
    });
    console.log('newUserCognito====>>>', newUserCognito);

    let params2 = {
      Username: userCognitoId,
      UserPoolId: UserPoolId,
    };
    console.log('params2===>>>', params2);

    const newUserCognito2 = await new Promise((resolve, reject) => {
      cognitoidentityserviceprovider.adminConfirmSignUp(params2, function (err, data) {
        if (err) {
          console.log('ERR ==>', err);
          reject({ ok: false, error: { err } });
        } else {
          console.log('DATA ==>', data);
          resolve({ ok: true, ...data });
        }
      });
    });
    console.log('newUserCognito2====>>>', newUserCognito2);
    // if (newUserCognito.ok) {
    let userUpdate = await User.updateOne(
      { userId: userCognitoId },
      {
        $set: { 'auth.confirmed': true, isSpecial: true },
      }
    );

    console.log('userUpdate===>>>', userUpdate);

    let vipDriverUpdate = await VipDrivers.updateOne(
      { phone: numberPhone },
      {
        $set: { 'account.enable': false },
      }
    );

    console.log('vipDriverUpdate===>>>', vipDriverUpdate);

    isSpecial = true;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        isSpecial,
      }),
    };
  } catch (err) {
    console.log('err =>', err);
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: err,
        message: 'Algo salio mal.',
      }),
    };
  }
};
