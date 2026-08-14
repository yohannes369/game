

// const { validationResult } = require('express-validator');
// const authService = require('./auth.service');


// function handleValidation(req) {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     const err = new authService.HttpError(
//       422,
//       errors.array()[0].msg
//     );

//     throw err;
//   }
// }



// async function register(req, res, next) {
//   try {

//     handleValidation(req);


//     const {
//       username,
//       password,
//       fullName,
//       location
//     } = req.body;



//     const user = await authService.registerUser({
//       username,
//       password,
//       fullName,
//       location
//     });



//     res.status(201).json({
//       message: 'Account created successfully.',
//       user
//     });



//   } catch (err) {

//     next(err);

//   }
// }





// async function login(req, res, next) {

//   try {

//     handleValidation(req);


//     const {
//       username,
//       password
//     } = req.body;



//     const result = await authService.login({
//       username,
//       password
//     });



//     res.json(result);



//   } catch (err) {

//     next(err);

//   }

// }






// async function refresh(req, res, next) {

//   try {

//     const {
//       refreshToken
//     } = req.body;



//     const result =
//       await authService.refreshAccessToken(
//         refreshToken
//       );



//     res.json(result);



//   } catch (err) {

//     next(err);

//   }

// }







// async function logout(req, res, next) {

//   try {

//     const {
//       refreshToken
//     } = req.body;



//     await authService.logout(
//       refreshToken
//     );



//     res.json({
//       message: 'Logged out successfully.'
//     });



//   } catch (err) {

//     next(err);

//   }

// }







// async function me(req, res, next) {

//   try {

//     const user =
//       await authService.findUserById(
//         req.user.id
//       );



//     if (!user) {

//       return res.status(404).json({
//         message: 'User not found.'
//       });

//     }



//     res.json({

//       user: authService.toPublicUser(user)

//     });



//   } catch (err) {

//     next(err);

//   }

// }








// async function changePassword(req, res, next) {

//   try {

//     handleValidation(req);


//     const {
//       currentPassword,
//       newPassword
//     } = req.body;



//     await authService.changePassword({

//       userId: req.user.id,

//       currentPassword,

//       newPassword

//     });



//     res.json({

//       message: 'Password changed successfully.'

//     });



//   } catch (err) {

//     next(err);

//   }

// }







// module.exports = {

//   register,

//   login,

//   refresh,

//   logout,

//   me,

//   changePassword

// };

const { validationResult } = require('express-validator');
const authService = require('./auth.service');

function handleValidation(req) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new authService.HttpError(
      422,
      errors.array()[0].msg
    );

    throw err;
  }
}

async function register(req, res, next) {
  try {
    handleValidation(req);

    const {
      username,
      password,
      fullName,
      phoneNumber,
      location
    } = req.body;

    const user = await authService.registerUser({
      username,
      password,
      fullName,
      phoneNumber,
      location
    });

    res.status(201).json({
      message: 'Account created successfully.',
      user
    });

  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    handleValidation(req);

    const {
      username,
      password
    } = req.body;

    const result = await authService.login({
      username,
      password
    });

    res.json(result);

  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const {
      refreshToken
    } = req.body;

    const result =
      await authService.refreshAccessToken(
        refreshToken
      );

    res.json(result);

  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const {
      refreshToken
    } = req.body;

    await authService.logout(
      refreshToken
    );

    res.json({
      message: 'Logged out successfully.'
    });

  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user =
      await authService.findUserById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    res.json({
      user: authService.toPublicUser(user)
    });

  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    handleValidation(req);

    const {
      currentPassword,
      newPassword
    } = req.body;

    await authService.changePassword({
      userId: req.user.id,
      currentPassword,
      newPassword
    });

    res.json({
      message: 'Password changed successfully.'
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  changePassword
};