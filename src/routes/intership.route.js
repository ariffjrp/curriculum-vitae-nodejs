const controller = require("../controllers/intership.controller.js")
const authJWT = require('../middleware/authJWT');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/v1/intership", [authJWT.verifyToken], controller.createIntership);
    app.patch("/api/v1/intership/:id", [authJWT.verifyToken], controller.updateIntership);
    app.delete("/api/v1/intership/:id", [authJWT.verifyToken], controller.deleteIntership);
}