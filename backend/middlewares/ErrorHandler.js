const errorHandler = (err, req, res, next) => {
  // Check if statusCode is set, otherwise default to 500
  const statusCode = res.statusCode ? res.statusCode : 500;

  // Set the response status code
  res.status(statusCode);

  // Respond with a JSON error message
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler };
