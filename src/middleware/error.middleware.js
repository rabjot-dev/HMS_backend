const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.isOperational ? error.message : "Internal server error";

  if (error.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "Document file must be 10MB or smaller";
  }

  const response = {
    success: false,
    message,
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
