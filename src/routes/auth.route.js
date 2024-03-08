const { verifyUser } = require('../middleware');
const controller = require('../controllers/auth.controller');
const MaxRetry = require('../utils/MaxRetry');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  /**
   * @swagger
   * /v1/api/auth/register:
   *   post:
   *     tags:
   *       - Auth Management
   *     summary: Register new account user
   *     description: Register new account user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
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
   *               address:
   *                 type: string
   *                 description: New user address
   *                 example: jln jono
   *               phone:
   *                 type: string
   *                 description: New user phone
   *                 example: 12345678905678
   *               gender:
   *                 type: string
   *                 description: New user gender
   *                 example: man
   *               bio:
   *                 type: string
   *                 description: New user bio
   *                 example: baca apa baca apa baca apa baca apa baca apa
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
  app.post('/v1/api/auth/register', [verifyUser.checkDuplicateEmail], controller.register);

  /**
   * @swagger
   * /v1/api/auth/sendEmail:
   *   post:
   *     tags:
   *       - Auth Management
   *     summary: Send Email for account user
   *     description: Send Email for account user
   *     responses:
   *       200:
   *         description: OTP berhasil dikirim!!
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: OTP berhasil dikirim!.
   *       500:
   *         description: Gagal mengirim email OTP.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: Gagal mengirim email OTP.
   */
  app.post('/v1/api/auth/sendEmail', controller.sendOTPByEmail);

  /**
   * @swagger
   * /v1/api/auth/verifyEmail:
   *   post:
   *     tags:
   *       - Auth Management
   *     summary: Verifikasi Email for account user
   *     description: Verifikasi Email for account user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               otp:
   *                 type: string
   *                 description: OTP is required
   *                 example: (otp yang terkirim di email)
   *     responses:
   *       200:
   *         description: OTP berhasil dikirim!!
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: OTP berhasil dikirim!.
   *       500:
   *         description: Gagal mengirim email OTP.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: Gagal mengirim email OTP.
   */
  app.post('/v1/api/auth/verifyEmail', controller.verifyEmail);

  app.get('/v1/api/auth/google', controller.autentikasiOAuth2);

  app.get('/v1/api/auth/login/oauth2/code/google', controller.callbackautentikasiOauth2);

  app.post('/v1/api/auth/resetPassword', controller.resetPassword);

  app.post('/v1/api/auth/confirm-reset-password', controller.confirmResetPassword);

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
  app.post('/v1/api/auth/refreshToken', controller.refreshToken);

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
  app.post('/v1/api/auth/login', MaxRetry, controller.login);
};
