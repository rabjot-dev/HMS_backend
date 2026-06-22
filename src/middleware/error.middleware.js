const ApiError = require("../utils/ApiError");

const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
    errorCode: "INTERNAL_SERVER_ERROR",
  });
};

module.exports = errorMiddleware;
