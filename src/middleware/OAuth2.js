function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).send({
      message: 'Unauthorized: User is not logged in.',
    });
  }
}

module.exports = isLoggedIn;
