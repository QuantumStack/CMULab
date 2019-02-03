// middleware for user-only routes (no students!)
module.exports = (req, res, next) => {
  if (!req.user) {
    req.session.oauth2return = req.originalUrl;
    return res.redirect('/login');
  }
  return next();
};
