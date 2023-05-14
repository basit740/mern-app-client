const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateUpdateUserInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name.trim() : "";
    data.email = !isEmpty(data.email) ? data.email.trim() : "";
    if (Validator.isEmpty(data.name)) { 
        errors.name = "Name field is required";
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = "ID field is required";
    } 

    return { 
        errors,
        isValid: isEmpty(errors)
    };
};
