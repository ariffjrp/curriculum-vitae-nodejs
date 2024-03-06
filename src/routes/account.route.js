const controller = require('../controllers/account.controller');
const authJWT = require('../middleware/authJWT');

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
   * /api/account/update/avatar:
   *   post:
   *     tags:
   *       - Account Management
   *     summary: Update Avatar
   *     description: Update the account's avatar.
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               avatar:
   *                 type: string
   *                 format: binary
   *     parameters:
   *     - name: x-access-token
   *       in: header
   *       description: User's access token
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Avatar updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: Avatar uploaded and processed successfully.
   *       400:
   *         description: Bad request.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message.
   *                   example: File not found.
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message.
   *                   example: Failed to process avatar. Please try again later.
   */
  app.post('/api/account/update/avatar', [authJWT.verifyToken], controller.uploadAvatar);

  /**
   * @swagger
   * /api/account/avatar:
   *   get:
   *     tags:
   *       - Account Management
   *     summary: Get Avatar
   *     description: Get the account's avatar. The avatar can be accessed by using the provided endpoint URL.
   *     parameters:
   *     - name: x-access-token
   *       in: header
   *       description: User's access token
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Avatar retrieved successfully. The avatar can be accessed using the provided URL.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Result message.
   *                   example: Avatar retrieved successfully.
   *                 url:
   *                   type: string
   *                   description: URL to access the avatar.
   *                   example: /api/account/avatar
   *       404:
   *         description: Avatar not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message.
   *                   example: Avatar not found.
   *       500:
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message.
   *                   example: Failed to fetch avatar. Please try again later.
   */
  app.get('/api/account/avatar', [authJWT.verifyToken], controller.getAvatar);

  /**
   * @swagger
   * /api/account:
   *   get:
   *     tags:
   *       - Account Management
   *     summary: Get Account accounts.
   *     description: Get Account accounts.
   *     parameters:
   *     - name: x-access-token
   *       in: header
   *       description: User's access token
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *          description: Users successfully fetched.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: Result message.
   *                    example: Users was fetched successfully.
   *                  data:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        id:
   *                          type: string
   *                          example: e9c03ec2-3cf3-4bec-9d72-85fad5e4a06b
   *                        name:
   *                          type: string
   *                          example: arif fajar
   *                        email:
   *                          type: string
   *                          example: fajar@gmail.com
   *                        address:
   *                          type: string
   *                          example: Jln soekarno hatta no 7
   *                        phone:
   *                          type: string
   *                          example: 9321732173
   *                        birthdate:
   *                          type: string
   *                          example: 32-01-2015
   *                        gender:
   *                          type: string
   *                          example: male
   *                        bio:
   *                          type: string
   *                          example: PT Cinta sejati
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
   *                  example: Failed to retrieve account. Please check application log.
   */
  app.get('/api/account', [authJWT.verifyToken], controller.getAbout);

  /**
   * @swagger
   * /api/account/update:
   *   patch:
   *     tags:
   *       - Account Management
   *     summary: Update Account
   *     description: Update Account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                name:
   *                  type: string
   *                  description: the account's name
   *                  example: John Doe
   *                email:
   *                  type: string
   *                  description: the account's email address
   *                  example: johndoe@example.com
   *                address:
   *                  type: string
   *                  description: the account's address
   *                  example: 123 Main Street
   *                phone:
   *                  type: string
   *                  description: the account's phone
   *                  example: 1234567890
   *                birthdate:
   *                  type: string
   *                  description: the account's birth date
   *                  example: 1990-01-01
   *                gender:
   *                  type: string
   *                  description: the account's gender
   *                  example: male
   *                bio:
   *                  type: string
   *                  description: the account's bio
   *                  example: Lorem ipsum dolor sit amet
   *     parameters:
   *     - name: x-access-token
   *       in: header
   *       description: User's access token
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *          description: Account updated successfully.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: result message
   *                    example: Account updated successfully.
   *       500:
   *          description: Application error.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: result message
   *                    example: Failed to retrieve account data. Please check the application log.
   */
  app.patch('/api/account/update', [authJWT.verifyToken], controller.updateAccount);
};
