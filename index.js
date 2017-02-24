var Router = require('router');
var cors = require('cors');
var fs = require('fs');
var _ = require('lodash');
var _api = require('./helpers/_api');
var Router = require('router');


var defaultAPIOptions = {
  prefix:'/api/v1',
}

module.exports = function(api, apiOptions){
	var router = Router();

	apiOptions = _.defaults(apiOptions, defaultAPIOptions);

	// midds
	router.use(cors());
	router.use(require('./helpers/resolveBasePath'));
	router.use(_api(apiOptions))

	router.use(require('./legacy-support'));

	// endpoints
	router.use('/browser/:id', require('./endpoints/browser'));
	router.use(apiOptions.prefix + '/:resource/:id?', require('./endpoints/api')(api));

	return router;
};
