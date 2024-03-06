const controller = require('../controllers/certificate.controller.js');
const authJWT = require('../middleware/authJWT')

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/v1/certificate", [authJWT.verifyToken], controller.CreateCertificate);
    app.patch("/api/v1/certificate/:id", [authJWT.verifyToken], controller.updateCertificate);
    app.delete("/api/v1/certificate/:id", [authJWT.verifyToken], controller.deleteCertificate);
}