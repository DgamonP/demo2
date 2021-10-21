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
    const userId = event.pathParameters.userId;
    const user = await User.findById(userId);
    let percentage = 0;
    if (user?.profile?.firstName) percentage++;
    if (user?.profile?.lastName) percentage++;
    if (user?.profile?.documentId) percentage++;
    if (user?.profile?.birthDate) percentage++;
    if (user?.profile?.pathPhoto) percentage++;
    if (user?.profile?.personReference) percentage++;
    if (user?.profile?.phoneReference) percentage++;

    if (user.address) {
      if (user?.address?.country) percentage++;
      if (user?.address?.city) percentage++;
      if (user?.address?.states) percentage++;
      if (user?.address?.street) percentage++;
    }

    if (user?.resources) {
      if (user?.resources?.photoDocumentIdFront) percentage++;
      if (user?.resources?.photoDocumentIdReverse) percentage++;
      if (user?.resources?.photoLicenseDrivers) percentage++;
    }

    percentage = percentage / 14;

    ////// buscar transportUnit ////////
    let userIdFind = user._id;

    const transportUnit = await TransportUnit.findOne({
      'drivers.userId': userIdFind,
      'drivers.active': true,
    });
    let percentageTransportUnit = 0;
    let featuresTransportUnitsCount = await FeaturesTransportUnit.find({
      requireForCarrier: true,
    }).countDocuments();
    let ratings = [];
    let average = 0;
    if (transportUnit) {
      let data = '';
      if (transportUnit?.plate) percentageTransportUnit++;
      if (transportUnit?.color) percentageTransportUnit++;
      if (transportUnit?.year) percentageTransportUnit++;
      if (transportUnit?.brand) percentageTransportUnit++;
      if (transportUnit?.typeTransportUnit) percentageTransportUnit++;
      if (transportUnit?.features) {
        for (const value of transportUnit.features) {
          const featuresTransportUnits = await FeaturesTransportUnit.find({
            requireForCarrier: true,
          });
          data = value.featuresTransportUnitId || '';
          for (const element of featuresTransportUnits) {
            let nuevo = {
              id: element?._id || '',
            };
            let nuevoElemento = {
              id: data,
            };
            let comparation = JSON.stringify(nuevo) === JSON.stringify(nuevoElemento);
            if (comparation) {
              percentageTransportUnit++;
            }
          }
          // data = value.featuresTransportUnitId || '';
          // if (value.featuresTransportUnitId == '60bf94758be5720008b7cc53')
          //   percentageTransportUnit++;
          // if (value.featuresTransportUnitId == '60bf94a98be5720008b7cc59')
          //   percentageTransportUnit++;
          // if (value.featuresTransportUnitId == '60bf952a8be5720008b7cc5f')
          //   percentageTransportUnit++;
        }
      }
      if (transportUnit?.engine) {
        if (transportUnit?.engine.engine) percentageTransportUnit++;
        if (transportUnit?.engine.fuelType) percentageTransportUnit++;
      }
      if (transportUnit?.resources) {
        if (transportUnit?.resources.photo) {
          if (transportUnit?.resources.photo.length > 0) percentageTransportUnit++;
        }
        if (transportUnit?.resources.photoRuat) percentageTransportUnit++;
      }
      // if (transportUnit.owner) {
      //   if (transportUnit.owner.length > 0) percentage++;
      // }

      ratings = await Rating.find({ userId: userIdFind, 'account.enable': true });
      if (ratings.length > 0) {
        let resultAverage = await Rating.aggregate([
          {
            $match: { userId: mongoose.Types.ObjectId(`${userId}`) },
          },
          {
            $group: {
              _id: '$userId',
              avgValue: { $avg: '$value' },
            },
          },
        ]);
        average = resultAverage[0]?.avgValue || 0;
        average = average.toFixed(1);
      }

      var div = 9 + featuresTransportUnitsCount;
      percentageTransportUnit = percentageTransportUnit / div;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: { ...user._doc, advancePercentage: percentage, ratingPercentage: average },
          transportUnit: { ...transportUnit._doc, advancePercentage: percentageTransportUnit },
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: { ...user._doc, advancePercentage: percentage, ratingPercentage: average },
          transportUnit: { advancePercentage: percentageTransportUnit },
        }),
      };
    }
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
