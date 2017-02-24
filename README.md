# WAPI
WAPI is a middleware for connect/express that make the common tasks in an API easier.

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
  postContact:function(req){
    //...
  }
}


app.use(wapi(api, optionalOptions));

app.listen(port,function(){
  console.log(port);
})

```
### Options (optional)

| Option  | Detail | Default Value |
| ------------- | ------------- | ------------- |
| prefix  | Is the prefix path for all the API calls | "/api/v1" |


## Endpoints

Every method of the API object is related to an URL. For example: `getUsers()` will
receive all the `GET` HTTP requests to the `/api/v1/users` endpoint.

Every method has to return a Promise.

```js

var api = {
  getUsers:function(req){
    return db.users.find();
  },
  postUsers:function(req){
    // ...
  },
  putUsers:function(req){
    // ...
  },
  deleteUsers:function(req){
    // ...
  },
}

app.use(wapi(api));

```

## req
Every API endpoint receive selected data from the request.

| Config  | Detail |
| ------------- | ------------- |
| resourceName  | /api/v1/{resourceName} |
| baseURL  | base url of the endpoint |
| id  | /api/v1/{resourceName}/{id} |
| body / payload  | The body from a POST/PUT request for JSON and multipart |
| query / options  | Query string params |
| files  | The files sent from a multipart request |
| access_token  | `Bearer 1234` authorization header or /api/v1/user/?access_token=1234  |
| headers  | HTTP headers |

**IMPORTANT:** In order to client connect with the server correctly, set `BASE_URL`
environment variable in the server. Example: `http://api.myserver.com/`

Otherwise, WAPI server will try to resolve this value but with certain risk of mistake.

## Client Side - Angular

```html
  <body ng-app="ngWapi" ng-cloak="waaws">
    <!-- Your code -->
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
    <script type="text/javascript" src="//myapi.com/browser/ng-wapi.js"></script>
  </body>
```
**PST!** If the app is already an Angular application just call `ng-wapi.js` and
set the `ngWapi` module as dependency of your app.

```js
  // example
  angular.module('myApp',['ngWapi']);
```

## Tips

- Avoid `{{var}}` to print text, use `ng-bind` instead. This prevent the blink effect when variables doesn't exist yet.

### Root Scope vars
This variables are available in all the ngWapi scope

| Var  | Type | Detail |
| ------------- | ------------- | ------------- |
| wLocation  | Object | Current URL representation |

## Forms
In order to connect a form to an endpoint of the API

1. Setup the `w-form` directive with the endpoint name as the value (eg: `users`,`contact`)
2. Place the `ng-submit` listener and call the `submit()` method
3. Set all the input that you wanna send with `ng-model="data.fieldName"`
4. Use `ng-show` to show `sending`, `submitted` or `fail` states
5. Use on-response-redirect attribute if want to redirect when submit finished.
   It is an expression so, it can access to the scope.
6. Add `file` attribute to create attach files buttons (dropzone) and use the `name` attribute.
  - In order to customize the preview of the files overwrite this CSS classes: `.dz-preview` `.dz-image`
  `.dz-details` `.dz-progress` `.dz-error-message` `.dz-success-mark` `.dz-error-mark`

### Scope vars

| Var  | Type | Detail |
| ------------- | ------------- | ------------- |
| data  | Object | Data to be submitted |
| submitting / sending  | Boolean | form is posting |
| submitted / success  | Boolean | the request is complete and no errors present |
| response  | Object | the response of the request |
| redirecting  | Boolean | when is redirecting |
| fail  | Boolean | Query string params |
| submit  | function | Function to be called in order to init the form post |

### Attributes

| Attribute  | Type | Detail |
| ------------- | ------------- | ------------- |
| w-form  | String | Start the directive and set the name of the endpoint to post |
| on-response-redirect  | Expression | URL to be redirected after post |
| redirect-delay  | Number | Milliseconds to wait before redirect |

```html
<form w-form="contact" ng-submit="submit()" on-response-redirect="'/ok'">
  <fieldset>
    <input type="text" ng-model="data.email" value="test@test.com" />
    <button>Enviar</button>
  </fieldset>

  <fieldset>
    <button type="button" file name="cv">CV</button>
    <div file name="picture">Pic</div>
  </fieldset>

  <div ng-show="sending">
    Enviando
  </div>
  <div ng-show="submitted">
    Great
  </div>
  <div ng-show="fail">
    :(
  </div>
  <!-- Also, we have the server response in a 'response' object -->
  <div>
    {{response}}
  </div>
</form>
```

## Get a resource

### Scope vars

| Var  | Type | Detail |
| ------------- | ------------- | ------------- |
| data  | Object | Data received from the endpoint |

| Attributes  | Type | Detail |
| ------------- | ------------- | ------------- |
| w-get  | String | Start the directive and set the path of the endpoint to be called |

```html
<div w-get="'/products/' + wLocation.id">

  <label>Product name</label>
  <div>
    {{data.name}}
  </div>

</div>
```

# Client side - Vanilla

```html
  ...
  <script type="text/javascript" src="//apihost/browser/index.js"></script>
  <script type="text/javascript">
    console.log(wapi);
  </script>
</body>
```
### Forms

It use the `.wapi-form-wrapper` `.wapi-form` `.wapi-form-done` `.wapi-form-fail`
classes to work

**IMPORTANT**: **data-form-name** attribute is necesary in the wrapper

```html
	<!-- HTML Structure - Look the classes !! and the data-form-name attribute -->
	<div class="wapi-form-wrapper" data-form-name="contact">
		<form class="wapi-form">
			<input type="text" name="email" value="test@test.com" />  
			<button>Enviar</button>
		</form>

		<div class="wapi-form-done">
			Great
		</div>
		<div class="wapi-form-fail">
			:(
		</div>
	</div>

	...

	<script type="text/javascript" src="//myapi.com/browser/index.js"></script>
	<script>
		wapi.autoInitForms();
	</script>
</body>
```
