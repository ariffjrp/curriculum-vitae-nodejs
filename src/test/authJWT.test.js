// const authJwt = require("../middleware/authJWT");

// describe('Auth Middleware', () => {
//   test('should throw an error if the token is invalid', () => {
//     const req = {
//       headers: {
//         'x-access-token': null
//       }
//     };

//     const res = {
//       status: jest.fn(() => res),
//       send: jest.fn()
//     };

//     const next = jest.fn();

//     // Memanggil middleware
//     authJwt.verifyToken(req, res, next);

//     // Memeriksa apakah fungsi status dan send dipanggil dengan benar
//     expect(res.status).toHaveBeenCalledWith(403);
//     expect(res.send).toHaveBeenCalledWith({
//       message: "No token provided!"
//     });

//     // Memeriksa bahwa next tidak dipanggil
//     expect(next).not.toHaveBeenCalled();
//   });
// });
