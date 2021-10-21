const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const moment = require('moment');
const { dbConnection } = require('./database/config');
const User = require('./models/user');

exports.lambdaHandler = async (event, context) => {
  await dbConnection(process.env.dataBaseConnection);
  let arnSns = process?.env?.arnSns || '';

  console.log('event====>>>>>', event);
  // console.log('context====>>>', context);
  let dateTime = moment().format();

  let phone_number = event.request.userAttributes.phone_number;
  let res = phone_number.split('+591');
  let phone = res[1];
  console.log('numero===>>', phone);
  let token = event.request.userAttributes['custom:token'] || '';

  let snsdss = new AWS.SNS({
    region: 'us-east-1',
  });

  let paramsdss = {
    // PlatformApplicationArn: 'arn:aws:sns:us-east-1:879323694935:app/GCM/sendNotificationDelta',
    // PlatformApplicationArn:
    //   'arn:aws:sns:us-east-1:345062269307:app/GCM/sendNotificationDeltaStaging',
    PlatformApplicationArn: arnSns,
    Token: token,
  };

  const createEndpoint = await snsdss.createPlatformEndpoint(paramsdss).promise();
  console.log('create endpoint', createEndpoint);

  const TargetArn = createEndpoint.EndpointArn;

  console.log('TargetArn===>>', TargetArn);

  let data = {
    userId: event.userName,
    type: 'Carrier',
    auth: {
      phone: phone,
      confirmed: false,
      countryCode: '+591',
    },
    device: {
      pushToken: TargetArn,
      phone: phone,
      registerDate: dateTime,
      lastAccessDate: dateTime,
      countryCode: '+591',
    },

    roles: [
      {
        modulesId: '60abe4cfd3456d0009f0a919',
        name: 'Home',
        create: true,
        read: true,
        update: true,
        delete: true,
        admin: false,
      },
    ],
    account: {
      enable: true,
    },
  };
  console.log('data====>>', data);
  let user = new User(data);
  const userCreated = await user.save();

  console.log('userCreated====>>', userCreated);
  return event;

  // event.response = { autoConfirmUser: true };
  // return response;
};
