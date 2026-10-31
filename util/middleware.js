const jwt = require("jsonwebtoken");
const logger = require("./logger");
const { SECRET } = require("../util/config");
const Session = require("../models/session");

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

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.token = authorization.substring(7);
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "Token invalid" });
    }
  } else {
    return res.status(401).json({ error: "Token missing" });
  }
  next();
};

const verifySession = async (req, res, next) => {
  const session = await Session.findOne({
    where: { userId: req.decodedToken.id, token: req.token },
  });

  if (!session) {
    return res.status(401).json({ error: "Session invalid" });
  }
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  verifySession,
};
