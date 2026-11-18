// services throw: new Error("msg", { cause: { status: 404 } })
function globalErrorMiddleware(err, req, res, next) {
  const status = err.cause?.status || 500;
  res.status(status).json({
    message: err.message,
    ...(process.env.NODE_ENV != "PROD" && { stack: err.stack }),
  });
}

export default globalErrorMiddleware;
