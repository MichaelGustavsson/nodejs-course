export const getData = (req, res, next) => {
  res.status(200).json({ success: true, message: `${req.headers.host}` });
};
