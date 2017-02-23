module.exports = function(apiOptions){
  return function(req, res, next){
    req._api = {
      options:apiOptions,
      baseURL:process.env.BASE_PATH + req.originalUrl.replace(req.path,'') + apiOptions.prefix
    };
    next();
  }
}
