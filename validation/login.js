const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateLoginInput(data) {
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email.trim() : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    if (Validator.isEmpty(data.email)) {
        errors.email = "ID field is required";
    } 

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};