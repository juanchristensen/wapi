var Router = require('router');
var cors = require('cors');
var fs = require('fs');
var _ = require('lodash');
var Router = require('router');

var defaultOptions = {
	prefix:'/api/v1',
}

module.exports = function(api, apiOptions){
	var router = Router();
	apiOptions = _.defaults(apiOptions, defaultOptions);

	// midds
	router.use(cors());
	router.use(require('./helpers/resolveURLOrigin'));
	router.use(require('./helpers/apiVars')(apiOptions));
	router.use(require('./legacy-support'));

	// endpoints
	router.use('/browser/:id', require('./endpoints/browser'));
	router.use(apiOptions.prefix + '/:resource/:id?', require('./endpoints/api')(api));

	return router;
};
