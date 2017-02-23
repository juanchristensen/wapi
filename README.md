# WAPI
WAPI is a middleware for express that make the common tasks in an API easier

<div>
 <a href="https://npmjs.org/package/wapi">
    <img src="https://img.shields.io/npm/v/wapi.svg?style=flat-square"
      alt="NPM version" />
  </a>
</div>

## Setup

```js

var express = require('express');
var wapi = require('wapi');
var port = process.env.PORT || 3004;
var app = express();

var api = {
  getUsers:function(){
    //...
  },
  postContact:function(options){
    //...
  }
}



// app.use(wapi(api,options)); // options are optional
app.use(wapi(api));

app.listen(port,function(){
	console.log(port);
})

```
#### Options

| Option  | Detail | Default Value |
| ------------- | ------------- | ------------- |
| prefix  | Is the prefix path for all the API calls | "/api/v1" |


## API

Every method of the API object is related to an URL. For example: `getUsers()` will
receive all the `GET` HTTP requests to the `/api/v1/users` endpoint.


Every method has to return a Promise.


```js
// ...
var api = {
  getUsers:function(config){
    return db.users.find();
  },
  postUsers:function(config){
    // ...
  },
  putUsers:function(config){
    // ...
  },
  deleteUsers:function(config){
    // ...
  },
}

app.use(wapi(api));
// ...
```

#### config
Every API method receive selected data from the request

| Config  | Detail |
| ------------- | ------------- |
| resourceName  | /api/v1/{resourceName} |
| id  | /api/v1/{resourceName}/{id} |
| body / payload  | The body from a POST/PUT request for JSON and multipart |
| query / options  | Query string params |
| files  | The files sent from a multipart request |
| access_token  | `Bearer 1234` authorization header or /api/v1/user/?access_token=1234  |
| headers  | HTTP headers |




## Client side setup

#### Vanilla JS (externalize `wapi` object)
```html
	...
	<script type="text/javascript" src="//apihost/browser/index.js"></script>
</body>
```

or

#### Angular


```html
		...
		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
	</head>
	<body ng-app="ngWapi" ng-cloak>
		...
		<script type="text/javascript" src="//apihost/browser/ng-wapi.js"></script>
	</body>
```
**PST:** If the app is already an Angular application just call `ng-wapi.js` and
set the `ngWapi` module as dependency of your app.

```js
	// example
	angular.module('myApp',['ngWapi']);
```


## Forms
In order to connect a form to an endpoint of the API

1. Setup the `w-form` directive with the endpoint name as the value (eg: `users`,`contact`)
2. Place the `ng-submit` listener and call the `submit()` method
3. Set all the input that you wanna send with `ng-model="data.fieldName"`
4. Use ng-show to show `submitted` or `fail` states
5. Add `file` attribute to create attach files buttons (dropzone) and use the `name` attribute.
  - In order to customize the preview of the files overwrite this CSS classes: `.dz-preview` `.dz-image`
  `.dz-details` `.dz-progress` `.dz-error-message` `.dz-success-mark` `.dz-error-mark`

```html
<form w-form="contact" ng-submit="submit()">

	<fieldset>
		<input type="text" ng-model="data.email" value="test@test.com" />
		<button>Enviar</button>
	</fieldset>

	<fieldset>
		<button type="button" file name="cv">CV</button>
		<div file name="picture">Pic</div>
	</fieldset>

	<div ng-show="submitted">
		Great
	</div>
	<div ng-show="fail">
		:(
	</div>
</form>
```
