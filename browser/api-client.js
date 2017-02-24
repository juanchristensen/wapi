require('whatwg-fetch');
var serialize = require('form-serialize');
var _ = {
	defaults:require('lodash/defaults'),
	forIn:require('lodash/forIn'),
	pick:require('lodash/pick')
}


if(!window._wapiConfigFromServer){
	console.warn('_wapiConfigFromServer is not present. This could generate problems 😳');
}


var config = _.defaults(window._wapiConfigFromServer || {},{
	baseURL:location.origin
});

var jsonFetch = function(url,options){
	options = options || {};
  var fullURL = config.baseURL + url;

	// headers
	var contentTypeHeaders = options.multipart ? {} : {
		'Content-Type': 'application/json'
	}

	var localStorageTokens = _.pick(localStorage,['id_token','access_token']);
	var authorizationHeaders = {};
	if(localStorageTokens.access_token){
		authorizationHeaders['Authorization'] = 'Bearer ' + localStorageTokens.access_token;
	}

	options = _.defaults(options, {
		headers:new Headers(_.defaults(localStorageTokens,contentTypeHeaders,authorizationHeaders))
	});

	if(!options.multipart){
		options.body = options.body && JSON.stringify(options.body);
	}

	return fetch(fullURL, options).then(function(res){
    var jsonPromise = res.json();
		if(res.status >= 400){
      throw jsonPromise;
    }else{
      return jsonPromise;
    }
  })
}

exports.submitForm = function(options){
  var url = '/' + options.name;
	var body = new FormData();

	_.forIn(options.body, function(value, key) {
		body.append(key,value);
	});
	_.forIn(options.files, function(value, key) {
		body.append(key,value);
	});

  return jsonFetch(url,{
    method: 'POST',
    body:body,
		multipart:true
  });
}

exports.getResource = function(options){
  var url = options.resourcePath;
  return jsonFetch(url);
}
exports.jsonFetch = jsonFetch;
