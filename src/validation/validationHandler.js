const BadRequestError = require("../Exceptions/badRequestError");

const handler = async (request, validator) => {
    let validationError;

    try {
        await validator.validateAsync(request)
    } catch (error) {
        validationError = ""
        error.details.forEach(element => {
            validationError += element.message + ". "
        });
    }

    if (validationError) {
        throw new BadRequestError(validationError);
    }
}

module.exports = handler;