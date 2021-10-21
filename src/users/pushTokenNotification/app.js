const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const moment = require('moment');
const { dbConnection } = require('./database/config');
const User = require('./models/user');
let response;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};
exports.lambdaHandler = async (event, context) => {
  const body = typeof event.body !== 'undefined' ? JSON.parse(event.body) : event;
  console.log('body ==> ', body);
  let dateTime = moment().format();
  try {
    await dbConnection(process.env.dataBaseConnection);
    let arnSns = process?.env?.arnSns || '';
    const userId = body.userId;
    delete body.userId;
    const pushToken = body.pushToken;
    delete body.pushToken;

    let snsdss = new AWS.SNS({
      region: 'us-east-1',
    });

    let paramsdss = {
      // PlatformApplicationArn: 'arn:aws:sns:us-east-1:879323694935:app/GCM/sendNotificationDelta',
      // PlatformApplicationArn:
      //   'arn:aws:sns:us-east-1:345062269307:app/GCM/sendNotificationDeltaStaging',
      PlatformApplicationArn: arnSns,
      Token: pushToken,
    };

    const createEndpoint = await snsdss.createPlatformEndpoint(paramsdss).promise();
    console.log('create endpoint', createEndpoint);

    const TargetArn = createEndpoint.EndpointArn;

    console.log('TargetArn===>>', TargetArn);

    let dataDevices = {
      ...body,
      registerDate: dateTime,
      lastAccessDate: dateTime,
      pushToken: TargetArn,
    };

    await User.updateOne(
      { userId },
      {
        $set: { device: dataDevices },
      }
    );

    response = {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Token de notificación guardado correctamente',
        // user: userDBSave,
      }),
    };
  } catch (err) {
    console.log('err =>', err);
    response = {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        message: 'Error',
        // error: err,
      }),
    };
  }
  return response;
};
