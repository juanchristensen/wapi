var browserify = require('browserify');
var path = require('path');
var _ = require('lodash');
var devEnv = process.env.NODE_ENV == 'development';
var cache = require('memory-cache');

module.exports = [function(req,res,next){
	var cacheKey = req.originalUrl;
	var cachedData = cache.get(cacheKey);

	var wr = res.write;
	var body = [];

	if(cachedData){
		return res.end(cachedData);
	}else{
		res.write = function(chunk){
			body.push(chunk);
			wr.call(res,chunk);
		}
		res.on('finish',function(){
			cache.put(cacheKey, body.join(''))
		});
		next();
	}
},function(req,res,next){
	var b = browserify();

	var configInjectedFromServer = {
		baseURL: req._api.baseURL
	};

	b.add(path.resolve(__dirname,'../browser/',req.params.id));

	if(!devEnv){
		b.transform({
			global: true
		}, require('uglifyify'));
	}

	res.write('window._wapiConfigFromServer='+JSON.stringify(configInjectedFromServer)+';');
	b.bundle().pipe(res);
}];
