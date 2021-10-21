const mongoose = require('mongoose');

const dbConnection = async (dataBaseConnection) => {
  try {
    // await mongoose.connect(process.env.MONGODB, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    // });
    console.log('cadena de conexion : ', dataBaseConnection);
    await mongoose.connect(
      // 'mongodb://deltauser:deltauserla@3.88.191.249:27017/deltastaging?authSource=deltastaging',
      dataBaseConnection,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );

    console.log('Base de datos online');
  } catch (error) {
    throw new Error('Error a la hora de iniciar la base de datos');
  }
};

module.exports = {
  dbConnection,
};
