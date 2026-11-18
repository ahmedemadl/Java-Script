function notFoundMiddleware(req, res) {
  res.status(404).json({ message: `invalid url ${req.url} or method ${req.method}` });
}
export default notFoundMiddleware;
