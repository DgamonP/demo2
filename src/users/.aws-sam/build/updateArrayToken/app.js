const { dbConnection } = require('./database/config');
const User = require('./models/user');
const TransportUnit = require('./models/transportUnit');
const FeaturesTransportUnit = require('./models/featuresTransportUnit');
const Rating = require('./models/rating');
const mongoose = require('mongoose');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};
exports.lambdaHandler = async (event, context) => {
  try {
    await dbConnection(process.env.dataBaseConnection);

    const users = await User.find();
    console.log('users===>>', users);

    for (const userData of users) {
      let userId = userData._id;
      let devices = userData?.devices || [];
      console.log('devices====>>', devices);
      if (devices.length > 0) {
        let dataDevices = userData?.devices[devices.length - 1];
        console.log('dataDevices====>>', dataDevices);
        await User.updateOne(
          { _id: userId },
          {
            $set: { device: dataDevices },
          }
        );
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'actualizaciones de todos los token',
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
