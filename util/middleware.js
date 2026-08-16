const logger = require("./logger");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error);

  switch (error.name) {
    case "SyntaxError":
      return response
        .status(400)
        .send({ error: `${error.name}: ${error.message}` });
    case "SequelizeValidationError":
      const validationErrors = [];

      error.errors.forEach((errorItem) => {
        if (errorItem.validatorKey === "isEmail") {
          validationErrors.push("username must be a valid email address");
        } else {
          validationErrors.push(error.message);
        }
      });

      return response.status(400).send({
        error: validationErrors,
      });
    case "SequelizeUniqueConstraintError":
      const constraintErrors = [];

      error.errors.forEach((errorItem) => {
        if (errorItem.validatorKey === "not_unique") {
          constraintErrors.push(errorItem.message);
        } else {
          constraintErrors.push(error.message);
        }
      });

      return response.status(400).send({
        error: constraintErrors,
      });

    case "SequelizeConnectionRefusedError":
      return response.status(ECONNREFUSED).send({
        error: "Could not connect to database",
      });
    default:
      next(error);
  }
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
