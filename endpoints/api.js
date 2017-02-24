var bodyParser = require('body-parser');
var Router = require('router');
var _ = require('lodash');
var multimiddHelper = require('../helpers/multipart-middleware.js');
var url = require('url');
var cache = require('memory-cache');
var devEnv = process.env.NODE_ENV == 'development';

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
    var referer = null;
    var cacheKey = req.method + req.originalUrl;

    if(req.headers.referer){
      referer = url.parse(req.headers.referer);
      referer.origin = referer.protocol + '//' + referer.host;
    }

    var options = _.chain(req)
                   .pick(['body', 'files', 'headers', 'query'])
                   .assign({
                      referer:referer,
                      payload:req.body,
                      resourceName:req.params.resource,
                      id:req.params.id,
                      access_token:getAccessToken(req),
                      options:req.query,
                      baseURL:req._api.baseURL
                   })
                   .value();

    // response time
    if(req.method == 'GET' && cache.get(cacheKey)){
      console.log('response from cache ',cacheKey);
      res.json(cache.get(cacheKey));
      return;
    }

    var promise = api[methodName] && api[methodName](options);

    if(promise && promise.then){
      promise = promise.then(function(response){
        if(response.redirect){
          res.redirect(response.redirect,307);
        }else{
          cache.put(cacheKey, response, devEnv ? 3000 : 500);
          console.log('response from promise',cacheKey)
          res.json(response);
        }
      });

      promise[promise.catch ? 'catch' : 'fail'](function(error){
        error = error || {};
        var status = error.status || 400;
        var detail = error.detail || {};

        res.status(status).json(detail);
      });
    }else{
      console.log('WAPI: method '+methodName+' doesn\'t return a Promise');
      next();
    }
  });

  return router;
}
