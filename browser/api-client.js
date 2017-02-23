require('whatwg-fetch');
var serialize = require('form-serialize');
var _ = {
	defaults:require('lodash/defaults'),
	forIn:require('lodash/forIn')
}


if(!window._wapiConfigFromServer){
	console.warn('_wapiConfigFromServer is not present. This could generate problems 😳');
}


var config = _.defaults(window._wapiConfigFromServer || {},{
	baseURL:location.origin
});

var jsonFetch = function(url,options){
  var fullURL = config.baseURL + url;
	var localStorageValuesToInclude = ['id_token','acccess_token'];

	var defaultHeaders = {
		'Content-Type': 'application/json'
	}

	localStorageValuesToInclude.forEach(function(name){
		if(localStorage.getItem(name)){ defaultHeaders[name] = localStorage.getItem(name); }
	});

	var newOptions = _.defaults(options, {
		headers:new Headers(defaultHeaders)
	});

	newOptions.body = newOptions.body && JSON.stringify(newOptions.body);

	return fetch(fullURL, newOptions).then(function(res){
    var json = res.json();
		if(res.status >= 400){
      throw json;
    }else{
      return json;
    }
  })
}

exports.submitForm = function(options){
  var url = config.baseURL + '/' + options.name;
	var body = new FormData();

	_.forIn(options.body, function(value, key) {
		body.append(key,value);
	});
	_.forIn(options.files, function(value, key) {
		body.append(key,value);
	});

  return fetch(url,{
    method: 'POST',
    body:body
  });
}
