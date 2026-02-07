exports.successResponse = (res, statusCode, data) => {
  res.status(statusCode).json(data);
};

exports.errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ error: message });
};
