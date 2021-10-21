const AWS = require('aws-sdk');
const { dbConnection } = require('./database/config');
const User = require('./models/user');

exports.lambdaHandler = async (event, context) => {
  console.log('EVENT ==>', event);

  try {
    await dbConnection(process.env.dataBaseConnection);
    if (event.triggerSource === 'TokenGeneration_NewPasswordChallenge') {
      const filter = { userId: event.userName };
      await User.findOne(filter)
        .exec()
        .then((userFind) => {
          if (!userFind) return null;
          userFind.auth.confirmed = true;
          return userFind.save();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (err) {
    console.log('err =>', err);
  }
  return event;
};
