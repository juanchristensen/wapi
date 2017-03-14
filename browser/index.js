var apiClient = require('./api-client');
var serialize = require('form-serialize');

exports.autoInitForms = function () {
    const formsWrappers = document.querySelectorAll('.wapi-form-wrapper');

    for (var formWrapperIdx=0; formWrapperIdx<formsWrappers.length; formWrapperIdx++) {
        const formWrapper = formsWrappers[formWrapperIdx];

        const form = formWrapper.querySelector('.wapi-form');
        const formDone = formWrapper.querySelector('.wapi-form-done');
        const formFail = formWrapper.querySelector('.wapi-form-fail');
        const formName = formWrapper.getAttribute('data-form-name');
        const formSubmit = formWrapper.querySelector('.wapi-form-submit');
        const formWait = formWrapper.getAttribute('data-form-wait');
        const formDefault = formSubmit.value;
        const formInputLabels = formWrapper.querySelectorAll('.wapi-form-input-label');

        const shouldHideForm = formWrapper.classList.contains('wapi-autohideform');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const obj = serialize(e.target, {hash: true});
            const files = {};

            for (var elementIndex = 0; elementIndex < e.target.elements.length; elementIndex++) {
                const element = e.target.elements[elementIndex];
                const elementName = element.name;

                if (element.type === 'file' && elementName !== '') {
                    for (var fileIndex = 0; fileIndex < element.files.length; fileIndex++) {
                        const file = element.files[fileIndex];
                        const fileName = elementName + "-" + fileIndex;
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

                for (var formInputLabelIdx=0; formInputLabelIdx<formInputLabels.length; formInputLabelIdx++) {
                    const formLabel = formInputLabels[formInputLabelIdx];

                    const formLabelDefault = formLabel.getAttribute('data-label-default');

                    if (typeof formLabelDefault !== 'undefined') {
                        formLabel.textContent = formLabelDefault;
                    }
                }
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
    }
};

exports.apiClient = apiClient;

window.wapi = module.exports;
