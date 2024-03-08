const controller = require('../controllers/portofolio.controller');
const authJWT = require('../middleware/authJWT');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.post('/v1/api/portofolio', [authJWT.verifyToken], controller.createPortofolio);
  app.patch('/v1/api/portofolio/:id', [authJWT.verifyToken], controller.updatePortoffolio);
  app.delete('/v1/api/portofolio/:id', [authJWT.verifyToken], controller.deletePortofolio);
};
