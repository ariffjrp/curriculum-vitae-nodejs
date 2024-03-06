const controller = require('../controllers/user.controller');
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
   * /api/logout:
   *   post:
   *     tags:
   *       - User Management
   *     summary: Log out Account
   *     description: Log out Account
   *     parameters:
   *     - name: x-access-token
   *       in: header
   *       description: User's access token
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *         description: Log Out successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                   description: Log Out successfully.
   *                   example: Logout successful!
   */
  app.post('/api/logout', [authJWT.verifyToken], controller.logOut);

  /**
   * @swagger
   * /api/users/updatePassword:
   *   patch:
   *     tags:
   *       - User Management
   *     summary: Update Password User
   *     description: Update Password User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                oldPassword:
   *                  type: string
   *                  description: the user's old password
   *                  example: Password123
   *                newPassword:
   *                  type: string
   *                  description: the user's new password
   *                  example: Password1234
   *                repeatPassword:
   *                  type: string
   *                  description: the user's repeat password
   *                  example: Password1234
   *     parameters:
   *     - name: x-access-token
   *       in: header
   *       description: User's access token
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *          description: User was updated password successfully
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: result message
   *                    example: Kata sandi berhasil diperbarui.
   *       400:
   *          description: User was updated password not match
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: result message
   *                    example: Kata sandi baru dan konfirmasi kata sandi tidak cocok.
   *       401:
   *          description: User was updated Invalid Password
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: result message
   *                    example: Kata sandi lama tidak valid.
   *       404:
   *          description: User not found
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: result message
   *                    example: Pengguna tidak ditemukan.
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
   *                    example: Gagal mengambil data pengguna. Harap periksa log aplikasi.
   */
  app.patch('/api/users/updatePassword', [authJWT.verifyToken], controller.updatePassword);

  /**
   * @swagger
   * /api/users/updateUsername:
   *   patch:
   *     tags:
   *       - User Management
   *     summary: Update Username User
   *     description: Update Username User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                newUsername:
   *                  type: string
   *                  description: the user's old password
   *                  example: paimen
   *     parameters:
   *     - name: x-access-token
   *       in: header
   *       description: User's access token
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *          description: User was updated Username successfully
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: result message
   *                    example: Username updated successfully.
   *       400:
   *          description: User was updated Username not match
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: result message
   *                    example: Username already exists.
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
   *                    example: Failed to fetch user data. Please check application logs.
   */
  app.patch('/api/users/updateUsername', [authJWT.verifyToken], controller.updateUsername);

  /**
   * @swagger
   * /api/users/deleteUser:
   *   delete:
   *     tags:
   *       - User Management
   *     summary: Delete user
   *     description: Delete user.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                username:
   *                  type: string
   *                  description: the user's username
   *                  example: paimen
   *     parameters:
   *     - name: x-access-token
   *       in: header
   *       description: User's access token
   *       required: true
   *       type: string
   *     responses:
   *       200:
   *          description: User was deleted successfully.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: Result message.
   *                    example: Account deleted successfully.
   *       404:
   *          description: User not found.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: Result message.
   *                    example: User not found.
   *       500:
   *          description: Application Error.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                    description: Application Error.
   *                    example: Failed to delete account. Please check application log.
   */
  app.delete('/api/users/deleteUser', [authJWT.verifyToken], controller.deleteAccount);
};
