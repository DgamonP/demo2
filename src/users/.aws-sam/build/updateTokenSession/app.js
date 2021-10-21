const { dbConnection } = require('./database/config');
const User = require('./models/user');
let response;
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};
exports.lambdaHandler = async (event, context) => {
  console.log('event ==> ', event);
  const body = typeof event.body !== 'undefined' ? JSON.parse(event.body) : event;
  console.log('body ==> ', body);
  try {
    await dbConnection(process.env.dataBaseConnection);

    const userId = event.pathParameters.userId;
    // const data = { tokenSession: body.tokenSession };
    await User.updateOne(
      { userId },
      {
        $set: { 'auth.tokenSession': body.tokenSession },
      },
      { upsert: true }
    );

    response = {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Token de sesión guardado correctamente',
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
