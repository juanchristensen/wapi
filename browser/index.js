var apiClient = require('./api-client');


exports.autoInitForms = function(){
	var formsWrappers = document.querySelectorAll('.wapi-form-wrapper');

	formsWrappers.forEach(function(formWrapper){
		var form = formWrapper.querySelector('.wapi-form');
		var formDone = formWrapper.querySelector('.wapi-form-done');
		var formFail = formWrapper.querySelector('.wapi-form-fail');
		var formName =  formWrapper.getAttribute('data-form-name');


		form.addEventListener('submit',function(e){
			e.preventDefault();

			var obj = serialize(e.target, { hash: true });

      return apiClient.submitForm({
				name:formName,
				body:obj
			}).then(function(){
				formDone.style.display = 'block';
				form.style.display = 'none';
			}).catch(function(){
				formDone.style.display = 'block';
				form.style.display = 'none';
			});


		})
	});
}

exports.apiClient = apiClient;

window.wapi = module.exports;
