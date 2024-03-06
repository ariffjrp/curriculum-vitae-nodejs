const controller = require("../controllers/education.controller.js")
const authJWT = require('../middleware/authJWT');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/v1/education", [authJWT.verifyToken], controller.createEducation);
    app.patch("/api/v1/education/:id", [authJWT.verifyToken], controller.updateEducation);
    app.delete("/api/v1/education/:id", [authJWT.verifyToken], controller.deleteEducation);
}