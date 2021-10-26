const moment = require('moment');
const momentTime = require('moment-timezone');

const { dbConnection } = require('./database/config');
const Travel = require('./models/travel');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

exports.lambdaHandler = async (event, context) => {
  try {
    console.log('entrooooo');
    await dbConnection(process.env.dataBaseConnection);
    console.log('event=====>>>', event);
    console.log('LAMOOOOOOO DESDE EL CROM');

    const date = moment().format();
    console.log('date======>>', date);
    const year = momentTime
      .utc(date, 'YYYY-MM-DDTHH:mm:ss')
      .tz('America/La_Paz')
      .format('YYYY-MM-DDTHH:mm:ss');

    console.log('year======>>', year);

    const res = await Travel.updateMany(
      { 'dates.loadingDate': { $lte: ISODate(year) }, publish: true },
      { $set: { publish: false } },
      { multi: true }
    );

    console.log('res=====>>>', res);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Bien',
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
