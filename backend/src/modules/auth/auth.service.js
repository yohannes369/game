

// const { pool } = require('../../config/db');
// const { hashPassword, comparePassword } = require('../../utils/password');
// const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/jwt');

// class HttpError extends Error {
//   constructor(status, message) {
//     super(message);
//     this.status = status;
//   }
// }

// function toPublicUser(row) {
//   if (!row) return null;

//   return {
//     id: row.id,
//     username: row.username,
//     fullName: row.full_name,
//     location: row.location,
//     role: row.role,
//     groupId: row.group_id,
//     isActive: !!row.is_active,
//     createdAt: row.created_at,
//   };
// }

// function buildTokenPayload(user) {
//   return {
//     id: user.id,
//     username: user.username,
//     role: user.role,
//     groupId: user.group_id,
//   };
// }

// async function findUserByUsername(username) {
//   const [rows] = await pool.query(
//     'SELECT * FROM users WHERE username = ? LIMIT 1',
//     [username]
//   );

//   return rows[0] || null;
// }

// async function findUserById(id) {
//   const [rows] = await pool.query(
//     'SELECT * FROM users WHERE id = ? LIMIT 1',
//     [id]
//   );

//   return rows[0] || null;
// }


// /**
//  * Register normal user account
//  */
// async function registerUser({ username, password, fullName, location }) {

//   const existing = await findUserByUsername(username);

//   if (existing) {
//     throw new HttpError(
//       409,
//       'This username is already taken.'
//     );
//   }


//   const passwordHash = await hashPassword(password);


//   const [result] = await pool.query(
//     `
//     INSERT INTO users
//     (
//       username,
//       password_hash,
//       full_name,
//       location,
//       role
//     )
//     VALUES (?, ?, ?, ?, ?)
//     `,
//     [
//       username,
//       passwordHash,
//       fullName,
//       location || null,
//       'user'
//     ]
//   );


//   const created = await findUserById(result.insertId);

//   return toPublicUser(created);
// }



// async function storeRefreshToken(userId, token, expiresAt) {

//   await pool.query(
//     `
//     INSERT INTO refresh_tokens
//     (
//       user_id,
//       token,
//       expires_at
//     )
//     VALUES (?, ?, ?)
//     `,
//     [
//       userId,
//       token,
//       expiresAt
//     ]
//   );

// }



// async function issueTokens(user) {

//   const payload = buildTokenPayload(user);

//   const accessToken = signAccessToken(payload);

//   const refreshToken = signRefreshToken(payload);


//   const expiresAt = new Date(
//     Date.now() + 7 * 24 * 60 * 60 * 1000
//   )
//   .toISOString()
//   .slice(0, 19)
//   .replace('T', ' ');


//   await storeRefreshToken(
//     user.id,
//     refreshToken,
//     expiresAt
//   );


//   return {
//     accessToken,
//     refreshToken
//   };
// }



// async function login({ username, password }) {

//   const user = await findUserByUsername(username);


//   if (!user) {
//     throw new HttpError(
//       401,
//       'Invalid username or password.'
//     );
//   }


//   if (!user.is_active) {
//     throw new HttpError(
//       403,
//       'This account has been deactivated.'
//     );
//   }


//   const passwordMatches = await comparePassword(
//     password,
//     user.password_hash
//   );


//   if (!passwordMatches) {
//     throw new HttpError(
//       401,
//       'Invalid username or password.'
//     );
//   }


//   const tokens = await issueTokens(user);


//   return {
//     user: toPublicUser(user),
//     ...tokens
//   };
// }



// /**
//  * Change logged-in user's password
//  */
// async function changePassword({
//   userId,
//   currentPassword,
//   newPassword
// }) {

//   const user = await findUserById(userId);


//   if (!user) {
//     throw new HttpError(
//       404,
//       'User not found.'
//     );
//   }


//   const passwordMatches = await comparePassword(
//     currentPassword,
//     user.password_hash
//   );


//   if (!passwordMatches) {
//     throw new HttpError(
//       401,
//       'Current password is incorrect.'
//     );
//   }


//   const newPasswordHash = await hashPassword(newPassword);


//   await pool.query(
//     `
//     UPDATE users
//     SET password_hash = ?
//     WHERE id = ?
//     `,
//     [
//       newPasswordHash,
//       userId
//     ]
//   );


//   return true;
// }



// async function refreshAccessToken(refreshToken) {

//   if (!refreshToken) {
//     throw new HttpError(
//       400,
//       'Refresh token is required.'
//     );
//   }


//   let payload;


//   try {

//     payload = verifyRefreshToken(refreshToken);

//   } catch (err) {

//     throw new HttpError(
//       401,
//       'Invalid or expired refresh token.'
//     );

//   }


//   const [rows] = await pool.query(
//     `
//     SELECT *
//     FROM refresh_tokens
//     WHERE token = ?
//     AND user_id = ?
//     LIMIT 1
//     `,
//     [
//       refreshToken,
//       payload.id
//     ]
//   );


//   if (!rows[0]) {
//     throw new HttpError(
//       401,
//       'Refresh token has been revoked.'
//     );
//   }


//   const user = await findUserById(payload.id);


//   if (!user || !user.is_active) {

//     throw new HttpError(
//       401,
//       'Account no longer available.'
//     );

//   }


//   await pool.query(
//     'DELETE FROM refresh_tokens WHERE token = ?',
//     [refreshToken]
//   );


//   const tokens = await issueTokens(user);


//   return {
//     user: toPublicUser(user),
//     ...tokens
//   };
// }



// async function logout(refreshToken) {

//   if (!refreshToken) return;


//   await pool.query(
//     'DELETE FROM refresh_tokens WHERE token = ?',
//     [refreshToken]
//   );

// }



// module.exports = {
//   HttpError,
//   toPublicUser,
//   registerUser,
//   login,
//   changePassword,
//   refreshAccessToken,
//   logout,
//   findUserById,
// };

const { pool } = require('../../config/db');

const {
  hashPassword,
  comparePassword,
} = require('../../utils/password');

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../../utils/jwt');

// =====================================================
// HTTP ERROR
// =====================================================

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

// =====================================================
// PUBLIC USER
// =====================================================

function toPublicUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    phoneNumber: row.phone_number,
    location: row.location,
    role: row.role,
    groupId: row.group_id,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
  };
}

// =====================================================
// TOKEN PAYLOAD
// =====================================================

function buildTokenPayload(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    groupId: user.group_id,
  };
}

// =====================================================
// FIND USER BY USERNAME
// =====================================================

async function findUserByUsername(username) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM users
    WHERE username = ?
    LIMIT 1
    `,
    [username]
  );

  return rows[0] || null;
}

// =====================================================
// FIND USER BY ID
// =====================================================

async function findUserById(id) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

// =====================================================
// REGISTER USER
// =====================================================

async function registerUser({
  username,
  password,
  fullName,
  phoneNumber,
  location,
}) {
  // Clean values
  username = String(username || '').trim();
  password = String(password || '');
  fullName = String(fullName || '').trim();
  phoneNumber = String(phoneNumber || '').trim();
  location = location
    ? String(location).trim()
    : null;

  // Check required fields
  if (!username) {
    throw new HttpError(
      422,
      'Username is required.'
    );
  }

  if (!password) {
    throw new HttpError(
      422,
      'Password is required.'
    );
  }

  if (!fullName) {
    throw new HttpError(
      422,
      'Full name is required.'
    );
  }

  if (!phoneNumber) {
    throw new HttpError(
      422,
      'Phone number is required.'
    );
  }

  // Check username
  const existingUsername =
    await findUserByUsername(username);

  if (existingUsername) {
    throw new HttpError(
      409,
      'This username is already taken.'
    );
  }

  // Check phone number
  const [existingPhone] = await pool.query(
    `
    SELECT id
    FROM users
    WHERE phone_number = ?
    LIMIT 1
    `,
    [phoneNumber]
  );

  if (existingPhone.length > 0) {
    throw new HttpError(
      409,
      'This phone number is already registered.'
    );
  }

  // Hash password
  const passwordHash =
    await hashPassword(password);

  // Insert user
  const [result] = await pool.query(
    `
    INSERT INTO users
    (
      username,
      password_hash,
      full_name,
      phone_number,
      location,
      role,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      username,
      passwordHash,
      fullName,
      phoneNumber,
      location,
      'user',
      1,
    ]
  );

  // Get created user
  const created =
    await findUserById(result.insertId);

  if (!created) {
    throw new HttpError(
      500,
      'Account was created but could not be loaded.'
    );
  }

  return toPublicUser(created);
}

// =====================================================
// STORE REFRESH TOKEN
// =====================================================

async function storeRefreshToken(
  userId,
  token,
  expiresAt
) {
  await pool.query(
    `
    INSERT INTO refresh_tokens
    (
      user_id,
      token,
      expires_at
    )
    VALUES (?, ?, ?)
    `,
    [
      userId,
      token,
      expiresAt,
    ]
  );
}

// =====================================================
// ISSUE TOKENS
// =====================================================

async function issueTokens(user) {
  const payload =
    buildTokenPayload(user);

  const accessToken =
    signAccessToken(payload);

  const refreshToken =
    signRefreshToken(payload);

  const expiresAt = new Date(
    Date.now() +
      7 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  await storeRefreshToken(
    user.id,
    refreshToken,
    expiresAt
  );

  return {
    accessToken,
    refreshToken,
  };
}

// =====================================================
// LOGIN
// =====================================================

async function login({
  username,
  password,
}) {
  const user =
    await findUserByUsername(
      username.trim()
    );

  if (!user) {
    throw new HttpError(
      401,
      'Invalid username or password.'
    );
  }

  if (!user.is_active) {
    throw new HttpError(
      403,
      'This account has been deactivated.'
    );
  }

  const passwordMatches =
    await comparePassword(
      password,
      user.password_hash
    );

  if (!passwordMatches) {
    throw new HttpError(
      401,
      'Invalid username or password.'
    );
  }

  const tokens =
    await issueTokens(user);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
}

// =====================================================
// CHANGE PASSWORD
// =====================================================

async function changePassword({
  userId,
  currentPassword,
  newPassword,
}) {
  const user =
    await findUserById(userId);

  if (!user) {
    throw new HttpError(
      404,
      'User not found.'
    );
  }

  const passwordMatches =
    await comparePassword(
      currentPassword,
      user.password_hash
    );

  if (!passwordMatches) {
    throw new HttpError(
      401,
      'Current password is incorrect.'
    );
  }

  const newPasswordHash =
    await hashPassword(newPassword);

  await pool.query(
    `
    UPDATE users
    SET password_hash = ?
    WHERE id = ?
    `,
    [
      newPasswordHash,
      userId,
    ]
  );

  return true;
}

// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

async function refreshAccessToken(
  refreshToken
) {
  if (!refreshToken) {
    throw new HttpError(
      400,
      'Refresh token is required.'
    );
  }

  let payload;

  try {
    payload =
      verifyRefreshToken(
        refreshToken
      );
  } catch (err) {
    throw new HttpError(
      401,
      'Invalid or expired refresh token.'
    );
  }

  const [rows] = await pool.query(
    `
    SELECT *
    FROM refresh_tokens
    WHERE token = ?
    AND user_id = ?
    LIMIT 1
    `,
    [
      refreshToken,
      payload.id,
    ]
  );

  if (!rows[0]) {
    throw new HttpError(
      401,
      'Refresh token has been revoked.'
    );
  }

  const user =
    await findUserById(payload.id);

  if (!user || !user.is_active) {
    throw new HttpError(
      401,
      'Account no longer available.'
    );
  }

  // Rotate refresh token
  await pool.query(
    `
    DELETE FROM refresh_tokens
    WHERE token = ?
    `,
    [refreshToken]
  );

  const tokens =
    await issueTokens(user);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
}

// =====================================================
// LOGOUT
// =====================================================

async function logout(refreshToken) {
  if (!refreshToken) {
    return;
  }

  await pool.query(
    `
    DELETE FROM refresh_tokens
    WHERE token = ?
    `,
    [refreshToken]
  );
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  HttpError,
  toPublicUser,
  registerUser,
  login,
  changePassword,
  refreshAccessToken,
  logout,
  findUserById,
};