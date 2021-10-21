exports.lambdaHandler = async (event, context) => {
  let response;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  try {
    // const ret = await axios(url);
    response = {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'hello world 8',
        // location: ret.data.trim()
      }),
    };
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        message: 'Error algo salió mal.',
        // location: ret.data.trim()
      }),
    };
  }

  return response;
};
