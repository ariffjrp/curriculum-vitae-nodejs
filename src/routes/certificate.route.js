const controller = require('../controllers/certificate.controller');
const authJWT = require('../middleware/authJWT');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.post('/v1/api/certificate', [authJWT.verifyToken], controller.CreateCertificate);
  app.patch('/v1/api/certificate/:id', [authJWT.verifyToken], controller.updateCertificate);
  app.delete('/v1/api/v1/certificate/:id', [authJWT.verifyToken], controller.deleteCertificate);
};
