// middleware for admin-only routes
module.exports = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    req.session.oauth2return = req.originalUrl;
    return res.redirect('/login');
  }
  return next();
};
