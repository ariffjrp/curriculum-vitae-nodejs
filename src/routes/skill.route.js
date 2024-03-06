const controller = require('../controllers/skill.controller');
const authJWT = require('../middleware/authJWT');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.post('/api/v1/skill', [authJWT.verifyToken], controller.CreateSkill);
  app.patch('/api/v1/skill/:id', [authJWT.verifyToken], controller.UpdateSkill);
  app.delete('/api/v1/skill/:id', [authJWT.verifyToken], controller.DeleteSkill);
};
