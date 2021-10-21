const { dbConnection } = require('./database/config');
const User = require('./models/user');
const TransportUnit = require('./models/transportUnit');
const FeaturesTransportUnit = require('./models/featuresTransportUnit');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};
exports.lambdaHandler = async (event, context) => {
  try {
    await dbConnection(process.env.dataBaseConnection);
    const companyClientId = event.pathParameters.companyClientId;
    const user = await User.find(
      { 'profile.companyId': companyClientId, type: 'CLIENT' },
      {
        fullName: { $concat: ['$profile.firstName', ' ', '$profile.lastName'] },
        userClientId: '$_id',
      }
    );
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        users: user,
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
