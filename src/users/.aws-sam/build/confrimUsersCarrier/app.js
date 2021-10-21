const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const { dbConnection } = require('./database/config');
const User = require('./models/user');

exports.lambdaHandler = async (event, context) => {
  try {
    console.log('EVENT ==>', event);
    console.log('context ==>', context);
    await dbConnection(process.env.dataBaseConnection);
    const userName = event.userName;
    // const data = { tokenSession: body.tokenSession };
    await User.updateOne(
      { userId: userName },
      {
        $set: { 'auth.confirmed': true },
      },
      { upsert: true }
    );
    return event;
  } catch (err) {
    console.log('err =>', err);
    return err;
  }
};
