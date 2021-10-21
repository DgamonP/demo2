const { dbConnection } = require('./database/config');
const User = require('./models/user');
const TransportUnit = require('./models/transportUnit');
let response;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};
exports.lambdaHandler = async (event, context) => {
  try {
    console.log('event====>>', event);
    let name = event?.queryStringParameters?.name;
    console.log('name====>>', name);
    await dbConnection(process.env.dataBaseConnection);
    const users = await User.aggregate([
      { $project: { fullName: { $concat: ['$profile.firstName', ' ', '$profile.lastName'] } } },
      {
        $match: {
          fullName: RegExp(name, 'i'),
        },
      },
    ]);
    console.log('users====>>', users);

    const arrayTransportIds = [];
    for (const user of users) {
      let transportUnitId = user._id;
      let transportUnit = await TransportUnit.findOne({
        'drivers.userId': transportUnitId,
        'drivers.active': true,
      });
      console.log('transportUnit=====>>>', transportUnit);
      let objectoNuevo = {};
      let comparation = JSON.stringify(transportUnit) === JSON.stringify(objectoNuevo);
      console.log('comparation=====>>>', comparation);
      let usersTransportUnit = {};
      if (comparation || transportUnit == null) {
      } else {
        usersTransportUnit = {
          user,
          transportUnit,
        };
        arrayTransportIds.push(usersTransportUnit);
      }
    }

    response = {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        users: arrayTransportIds,
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
