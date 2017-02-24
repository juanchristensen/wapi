var _ = require('lodash');

module.exports = function(apiOptions){
  return function(req,res,next){
    var host = (req.secure ? 'https://' : 'http://') + req.headers.host;
    req._api = _.assign({}, apiOptions, {
      baseURL: host + req.originalUrl.replace(req.path,'') + apiOptions.prefix
    });
    next();
  }
}
