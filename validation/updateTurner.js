const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateTurnerInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.from = !isEmpty(data.from) ? data.from : "";
    data.to = !isEmpty(data.to) ? data.to : "";

    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }
    if (Validator.isEmpty(data.from)) {
        errors.from = "From field is required";
    }
    if (Validator.isEmpty(data.to)) {
        errors.to = "To field is required";
    } else if (!data.to.toLowerCase().startsWith('http://') && !data.to.toLowerCase().startsWith('https://')) {
        errors.to = "To field must start with 'http://' or 'https://'";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
