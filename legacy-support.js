var Router = require('router');
var router = Router();

router.get('/browser.js',function(req, res, next){
  res.write("console.warn('WAPI: /browser.js URL is deprecated. use /browser/index.js instead.');");
  next();
},require('./endpoints/browser'));

module.exports = router;
