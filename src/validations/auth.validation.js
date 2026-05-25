const { body } = require("express-validator");

const loginValidation = [
  body("loginId")
    .notEmpty()
    .withMessage("Email/EmpId is required"),


  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const createPasswordValidation = [
  body("loginId")
    .notEmpty()
    .withMessage("Login ID is required"),

  body("temporaryPassword")
    .notEmpty()
    .withMessage(
      "Temporary password is required",
    ),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage(
      "New password must be at least 8 characters long",
    ),

];
/*
|--------------------------------------------------------------------------
| Forgot Password Validation
|--------------------------------------------------------------------------
*/
const forgotPasswordValidation = [

  body(

    'email',
  )

  .isEmail()

  .withMessage(
    'Valid email is required',
  ),
];

/*
|--------------------------------------------------------------------------
| Reset Password Validation
|--------------------------------------------------------------------------
*/
const resetPasswordValidation = [

  body(

    'email',
  )

  .isEmail()

  .withMessage(
    'Valid email is required',
  ),

  body(

    'securityAnswer',
  )

  .notEmpty()

  .withMessage(
    'Security answer is required',
  ),

  body(

    'newPassword',
  )

  .isLength({

    min: 6,
  })

  .withMessage(
    'Password must be at least 6 characters',
  ),
];

module.exports = {
  loginValidation,
  createPasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};