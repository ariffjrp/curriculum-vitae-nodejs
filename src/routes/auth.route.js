const { verifyUser } = require('../middleware');
const controller = require('../controllers/auth.controller.js');
const MaxRetry = require('../utils/MaxRetry.js')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * @swagger
   * /api/users/register:
   *   post:
   *     tags:
   *       - User Management
   *     summary: Register new account user
   *     description: Register new account user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 description: New user username
   *                 example: JonoBakri234
   *               email:
   *                 type: string
   *                 description: New user email address
   *                 example: JonoBakri12@gmail.com
   *               password:
   *                 type: string
   *                 description: New user password
   *                 example: Password123
   *               repeatPassword:
   *                 type: string
   *                 description: New user repeat password
   *                 example: Password123
   *               name:
   *                 type: string
   *                 description: New user username
   *                 example: Jono Bakri
   *     responses:
   *       200:
   *         description: User was created successfully!
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: User was created successfully.
   *       500:
   *         description: Failed to create user. Please check application log.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: Failed to create user. Please check application log.
   */
  app.post("/api/register", [verifyUser.checkDuplicateUsername], controller.register);

  app.post("/api/sendEmail", controller.sendOTPByEmail);

  app.post("/api/verifyEmail", controller.verifyEmail);

  app.get("/auth/google", controller.autentikasiOAuth2);
  
  app.get("/login/oauth2/code/google", controller.callbackautentikasiOauth2);

  app.post("/auth/resetPassword", controller.resetPassword)

  app.post("/confirm-reset-password", controller.confirmResetPassword)

  /**
   * @swagger
   * /api/users/refreshToken:
   *   post:
   *     tags:
   *       - User Management
   *     summary: Generate a new refresh token for account
   *     description: Generate a new refresh token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 description: Send out user's refresh token.
   *                 example: 9ad656a6-4c90-4701-8cd1-2d65ff08a0ae
   *     responses:
   *       200:
   *         description: Access token was generated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                   description: New generated access token.
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5MjRiOTBjLTQ4MDUtNGY0Mi1hNGMxLWRhNWRkMjQzZWZmMiIsImlhdCI6MTY3ODMwOTE4NSwiZXhwIjoxNjc4MzEyNzg1fQ.QtXPJ4Xknj6JGDCzIvj92cZKmsu3206kJvXyi-Y-p30
   *                 refreshToken:
   *                   type: string
   *                   description: User's refresh token.
   *                   example: 9ad656a6-4c90-4701-8cd1-2d65ff08a0ae
   * 
   *       400:
   *         description: Refresh token is not in database!
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: Refresh token is not in database!
   *       401:
   *         description: Refresh Token is required!
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: Refresh Token is required!
   *       403:
   *         description: Refresh token has expired. Please make a new signin request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: Refresh token has expired. Please make a new signin request
   *       500:
   *         description: Failed to generate access token. Please check application log.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: Failed to generate access token. Please check application log.
   */
  app.post("/api/users/refreshToken", controller.refreshToken);

  /**
   * @swagger
   * /api/users/login:
   *   post:
   *     tags:
   *       - User Management
   *     summary: Logs user into application
   *     description: Logs user into application using registered username & password.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                username:
   *                  type: string
   *                  description: The user's username.
   *                  example: JonoBakri234
   *                password:
   *                  type: string
   *                  description: The user's password.
   *                  example: Password123
   *     responses:
   *       200:
   *          description: Successfully logged in.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  id:
   *                    type: string
   *                    description: User's uuid.
   *                    example: a588f982-af3e-4b9e-85dc-4e662e93a8be
   *                  username:
   *                    type: string
   *                    description: User's username.
   *                    example: admintest
   *                  accessToken:
   *                    type: string
   *                    description: User's access token to access API.
   *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE1ODhmOTgyLWFmM2UtNGI5ZS04NWRjLTRlNjYyZTkzYThiZSIsImlhdCI6MTY3ODMwODMwMywiZXhwIjoxNjc4MzExOTAzfQ.S6o8jOirnqTy7N59049xBIdfujWFBHmA5fNgt_C1P64
   *                  refreshToken:
   *                    type: string
   *                    description: User's refresh token to generate new access token.
   *                    example: 95100f31-90d9-4173-9b4c-18980aa5499d
   *       401:
   *         description: Invalid password. incorrect password.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                message:
   *                  type: string
   *                  description: Result message.
   *                  example: Invalid Password.
   *       404:
   *         description: User not found, incorrect username.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                message:
   *                  type: string
   *                  description: Result message.
   *                  example: username address is not registered. Check the username address again.
   *       500:
   *         description: Application error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                message:
   *                  type: string
   *                  description: Application error.
   *                  example: Failed to login. Please check application log.
   */
  app.post("/api/login", MaxRetry ,controller.login);
};