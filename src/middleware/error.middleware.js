const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    message: error.isOperational ? error.message : "Internal server error",
  };

  if (error.errorCode) {
    response.errorCode = error.errorCode;
  }

  if (error.errors) {
    response.errors = error.errors;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("ERROR:", error);
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
