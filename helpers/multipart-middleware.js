var multiparty = require('multiparty');

module.exports = function(){
  return function(req,res,next){
    if(req.method == 'POST' || req.method == 'PUT'){
      var form = new multiparty.Form();
      form.parse(req, function(err, fields, files) {

        if(fields){
          req.body = req.body || {};

          Object.keys(fields).forEach(function(k){
            req.body[k] = fields[k][0];
          });
        }

        if(files){
          req.files = Object.keys(files).map(function(k){
            return files[k][0];
          });
        }

        next();
      });
    }else{
      next();
    }
  }
}
