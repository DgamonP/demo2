const AWS = require('aws-sdk');
const { dbConnection } = require('./database/config');
const User = require('./models/user');
const Company = require('./models/company');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2017-05-30',
});
const UserPoolId = process?.env?.ARNCognito || '';
const keyFirstUserParams = process?.env?.keyFirstUser || '';
let response;
const keyFirstUser = '373968026DXTI';

exports.lambdaHandler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  try {
    if (keyFirstUserParams === keyFirstUser) {
      console.log('UserPoolId===>>', UserPoolId);
      const arrayNameUserPool = UserPoolId.split('/');
      console.log('arrayNameUserPool', arrayNameUserPool);
      let nameUserPool = arrayNameUserPool[1];
      console.log('nameUserPool==>>', nameUserPool);
      console.log('cognitoidentityserviceprovider===>>', cognitoidentityserviceprovider);
      await dbConnection(process.env.dataBaseConnection);
      const body = typeof event.body !== 'undefined' ? JSON.parse(event.body) : event;
      const data = body;
      let params = {
        Username: data.auth.email,
        UserPoolId: nameUserPool,
      };
      // let companyId = data?.profile?.companyId || '';
      let emailUser = data?.auth?.email || '';
      // params['Username'] = data.email;
      // params['UserPoolId'] = UserPoolId;

      console.log('EVENT ==>', event);

      if (emailUser == '' || emailUser == null || emailUser == false) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            message: 'Requiere email',
          }),
        };
      }

      const userSearch = await User.findOne({ 'auth.email': emailUser });

      if (userSearch) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            message: 'Email ya registrado',
          }),
        };
      }
      console.log('paso  1');
      const newUser = await new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.adminCreateUser(params, function (err, data) {
          if (err) {
            // callback.callbackRegisterComplete(err);
            console.log('ERR ==>', err);
            reject({ ok: false, error: { err } });
          } else {
            console.log('DATA ==>', data);
            resolve({ ok: true, ...data });
            // callback.callbackRegisterComplete(null); //
          }
        });
      });

      let userDBSave = {};
      if (newUser.ok) {
        // const company = await Company.findOne({ _id: companyId }).select('access');
        // console.log('company===>>', company);
        // let accessArray = company?.access || [];
        // let moduleArray = [];
        // for (const moduleCompany of accessArray) {
        //   console.log('moduleCompany====>>', moduleCompany);
        //   let moduleId = moduleCompany.modulesId;
        //   let nameModule = moduleCompany.name;
        //   let codeModule = moduleCompany.code;
        //   let module = {
        //     modulesId: moduleId,
        //     name: nameModule,
        //     code: codeModule,
        //     read: false,
        //     write: false,
        //   };

        //   moduleArray.push(module);
        // }
        const payload = {
          userId: newUser.User.Username,
          ...data,
        };
        const userDB = new User(payload);
        userDBSave = await userDB.save();
      }

      response = {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Usuario creado exitosamente',
          user: userDBSave,
        }),
      };
    } else {
      response = {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Error Key diferentes',
        }),
      };
    }
    // event.response = { autoConfirmUser: true };
  } catch (err) {
    response = {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        message: 'Error',
        error: err,
      }),
    };
    // return err;
  }
  return response;
};
