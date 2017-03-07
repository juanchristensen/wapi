var apiClient = require('./api-client');
var serialize = require('form-serialize');

exports.autoInitForms = function () {
    var formsWrappers = document.querySelectorAll('.wapi-form-wrapper');

    formsWrappers.forEach(function (formWrapper) {
        var form = formWrapper.querySelector('.wapi-form');
        var formDone = formWrapper.querySelector('.wapi-form-done');
        var formFail = formWrapper.querySelector('.wapi-form-fail');
        var formName = formWrapper.getAttribute('data-form-name');
        var formSubmit = formWrapper.querySelector('.wapi-form-submit');
        var formWait = formWrapper.getAttribute('data-form-wait');
        var formDefault = formSubmit.value;
        var formInputLabels = formWrapper.querySelectorAll('.wapi-form-input-label');

        var shouldHideForm = formWrapper.classList.contains('wapi-autohideform');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var obj = serialize(e.target, {hash: true});
            var files = {};

            for (var elementIndex = 0; elementIndex < e.target.elements.length; elementIndex++) {
                var element = e.target.elements[elementIndex];
                var elementName = element.name;

                if (element.type === 'file' && elementName !== '') {
                    for (var fileIndex = 0; fileIndex < element.files.length; fileIndex++) {
                        var file = element.files[fileIndex];
                        var fileName = elementName + "-" + fileIndex;
                        files[fileName] = file;
                    }
                }
            }

            formSubmit.value = formWait;

            return apiClient.submitForm({
                name: formName,
                body: obj,
                files: files
            }).then(function () {
                if (shouldHideForm) {
                    form.style.display = 'none';
                }else {
                    setTimeout(function () {
                        formDone.style.display = 'none';
                        formFail.style.display = 'none';
                    }, 10000);
                }

                formDone.style.display = 'block';
                formFail.style.display = 'none';
                formSubmit.value = formDefault;
                form.reset();

                formInputLabels.forEach(function (formLabel) {
                    var formLabelDefault = formLabel.getAttribute('data-label-default');

                    if (typeof formLabelDefault !== 'undefined') {
                        formLabel.textContent = formLabelDefault;
                    }
                });

            }).catch(function () {
                if (shouldHideForm) {
                    form.style.display = 'none';
                }else {
                    setTimeout(function () {
                        formDone.style.display = 'none';
                        formFail.style.display = 'none';
                    }, 10000);
                }

                formDone.style.display = 'none';
                formFail.style.display = 'block';
                formSubmit.value = formDefault;
            });


        })
    });
};

exports.apiClient = apiClient;

window.wapi = module.exports;
