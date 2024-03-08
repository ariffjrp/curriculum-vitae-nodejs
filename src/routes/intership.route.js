const controller = require('../controllers/intership.controller');
const authJWT = require('../middleware/authJWT');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.post('/v1/api/intership', [authJWT.verifyToken], controller.createIntership);
  app.patch('/v1/api/intership/:id', [authJWT.verifyToken], controller.updateIntership);
  app.delete('/v1/api/intership/:id', [authJWT.verifyToken], controller.deleteIntership);
};
