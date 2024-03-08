const controller = require('../controllers/project.controller');
const authJWT = require('../middleware/authJWT');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.post('/v1/api/project', [authJWT.verifyToken], controller.createProject);
  app.patch('/v1/api/project/:id', [authJWT.verifyToken], controller.updateProject);
  app.delete('/v1/api/project/:id', [authJWT.verifyToken], controller.deleteProject);
};
