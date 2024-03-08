const controller = require('../controllers/education.controller');
const authJWT = require('../middleware/authJWT');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.post('/v1/api/education', [authJWT.verifyToken], controller.createEducation);
  app.patch('/v1/api/education/:id', [authJWT.verifyToken], controller.updateEducation);
  app.delete('/v1/api/education/:id', [authJWT.verifyToken], controller.deleteEducation);
};
