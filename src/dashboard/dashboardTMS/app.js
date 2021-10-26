const mongoose = require('mongoose');

const { dbConnection } = require('./database/config');
const Operation = require('./models/operation');
const OperationStatus = require('./models/operationStatus');
const Travel = require('./models/travel');
const Stages = require('./models/stages');
const User = require('./models/user');
const Task = require('./models/task');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

exports.lambdaHandler = async (event, context) => {
  try {
    console.log('evento');
    await dbConnection(process.env.dataBaseConnection);
    let userId = event?.queryStringParameters?.userId;
    console.log('userId====>>', userId);
    const userData = await User.findById(userId);
    console.log('userData====>>', userData);
    let isAdmin = userData?.isAdmin || false;
    const idStatusCurso = await OperationStatus.findOne({ order: 2 });
    console.log('idStatusCurso====>>>', idStatusCurso);
    const idStatusTopay = await OperationStatus.findOne({ order: 3 });
    console.log('idStatusTopay====>>>', idStatusTopay);
    let operationsCount = [];
    if (isAdmin) {
      let companyUser = userData?.profile?.companyId || '';
      operationsCount = await Operation.aggregate([
        {
          $match: {
            $or: [
              {
                statusOperationId: mongoose.Types.ObjectId(`${idStatusCurso._id}`),
              },
              {
                statusOperationId: mongoose.Types.ObjectId(`${idStatusTopay._id}`),
              },
            ],
            companyOperatorId: mongoose.Types.ObjectId(`${companyUser}`),
            'row.disableDate': { $exists: false },
          },
        },
      ]);
    } else {
      operationsCount = await Operation.aggregate([
        {
          $match: {
            $or: [
              {
                statusOperationId: mongoose.Types.ObjectId(`${idStatusCurso._id}`),
              },
              {
                statusOperationId: mongoose.Types.ObjectId(`${idStatusTopay._id}`),
              },
            ],
            userOperatorId: mongoose.Types.ObjectId(`${userId}`),
            'row.disableDate': { $exists: false },
          },
        },
      ]);
    }
    console.log('operationsCount======>>>', operationsCount);
    let operationsActive = operationsCount.length;
    console.log('operationsActive====>>>', operationsActive);

    let arrayId = [];

    for (const operation of operationsCount) {
      let id = operation._id;
      arrayId.push(id);
    }

    const travelFull = await Travel.find({
      operationId: {
        $in: arrayId,
      },
      $or: [
        {
          'loadingOrder.LoadingOrderStatus': { $size: 1 },
        },
        {
          'loadingOrder.LoadingOrderStatus': { $size: 2 },
        },
        {
          'loadingOrder.LoadingOrderStatus': { $size: 3 },
        },
      ],
      'row.disableDate': { $exists: false },
    });
    let travelActive = travelFull.length;
    console.log('travelActive====>>>', travelActive);

    const travelToPay = await Travel.find({
      operationId: {
        $in: arrayId,
      },
      'loadingOrder.LoadingOrderStatus': { $size: 3 },
      'loadingOrder.LoadingOrderStatus.2.order': 3,
    });

    let travelToPayCant = travelToPay.length;
    console.log('travelToPayCant====>>>', travelToPayCant);

    let arrayIdLoadingOrder = [];

    for (const travelOne of travelFull) {
      let loadingOrderIds = travelOne?.loadingOrder?.loadingOrderId || '';
      arrayIdLoadingOrder.push(loadingOrderIds);
    }

    console.log('arrayIdLoadingOrder=====>>>', arrayIdLoadingOrder);

    const stagesTasksOperator = await Stages.find({
      loadingOrderId: {
        $in: arrayIdLoadingOrder,
      },
      'tasks.allow.operator': true,
    });

    console.log('stagesTasksOperator=====>>>', stagesTasksOperator);

    let sum = 0;
    let arrayStagesIdOperator = [];
    for (const stagesOperator of stagesTasksOperator) {
      let idStagesOperator = stagesOperator._id;
      arrayStagesIdOperator.push(idStagesOperator);
    }
    let fullTaskOperator = [];
    fullTaskOperator = await Task.find({
      stagesId: { $in: arrayStagesIdOperator },
      'allow.operator': true,
    });

    if (fullTaskOperator.length > 1) {
      sum = fullTaskOperator.length;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        operationsActive: operationsActive,
        travelActive,
        travelToPay: travelToPayCant,
        tasksPending: sum,
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
