var bodyParser = require('body-parser');
var Router = require('router');
var _ = require('lodash');
var multimiddHelper = require('../helpers/multipart-middleware.js');


var getAccessToken = function(req){
  var headerToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];

  if(headerToken){
    return headerToken;
  }else if(req.query.access_token){
    return req.query.access_token;
  }else{
    return null;
  }
}

module.exports = function(api){

  var router = Router({mergeParams: true});

  router.use(bodyParser.json({limit: '50mb'}))
  router.use(multimiddHelper());


  router.use(function(req,res,next){
    var methodName = _.camelCase(req.method + '-' + req.params.resource);

    var options = _.chain(req)
                   .pick(['body', 'files', 'headers', 'query'])
                   .defaults({
                      payload:req.body,
                      resourceName:req.params.resource,
                      id:req.params.id,
                      access_token:getAccessToken(req),
                      options:req.query
                   })
                   .value();

    var promise = api[methodName] && api[methodName](options);

    if(promise && promise.then){
      promise = promise.then(function(success){
        res.json(success)
      });

      var failMethodName = promise.catch ? 'catch' : 'fail';

      promise[failMethodName](function(error){
        error = _.defaults(error,{ status:400,data:{error:error.toString()} })
        res.status(error.status).json(error.data);
      });
    }else{
      console.log('WAPI: method '+methodName+' doesn\'t return a Promise');
    }
  });

  return router;
}
