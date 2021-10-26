const axios = require('axios');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

exports.lambdaHandler = async (event, context) => {
  try {
    let data1 = -17.865107;
    let data2 = -63.268398;
    let data3 = -16.487408;
    let data4 = -68.13559;
    let key = 'AIzaSyAE8QygNNc0lhFs5oY0KtIJZoR17LDSJWM';
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${data1},${data2}&destination=${data3},${data4}&key=${key}`
    );
    console.log(response);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err,
        message: 'Algo salio mal.',
      }),
    };
  }
};
