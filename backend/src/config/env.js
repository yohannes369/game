// require('dotenv').config();

// function required(name, fallback) {
//   const value = process.env[name] ?? fallback;
//   if (value === undefined) {
//     throw new Error(`Missing required environment variable: ${name}`);
//   }
//   return value;
// }

// module.exports = {
//   port: process.env.PORT || 5001,
//   nodeEnv: process.env.NODE_ENV || 'development',
//   clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

//   db: {
//     host: required('DB_HOST', '127.0.0.1'),
//     port: Number(process.env.DB_PORT) || 3306,
//     user: required('DB_USER', 'root'),
//     password: process.env.DB_PASSWORD || '',
//     database: required('DB_NAME', 'auth_system'),
//   },

//   jwt: {
//     accessSecret: required('JWT_ACCESS_SECRET', 'dev_access_secret_change_me'),
//     refreshSecret: required('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
//     accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
//     refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
//   },

//   seedAdmin: {
//     username: process.env.SEED_ADMIN_USERNAME || 'admin',
//     password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
//     fullName: process.env.SEED_ADMIN_FULLNAME || 'System Administrator',
//   },
// // };

// require('dotenv').config();

// function required(name, fallback) {
//   const value = process.env[name] ?? fallback;

//   if (value === undefined || value === '') {
//     throw new Error(`Missing required environment variable: ${name}`);
//   }

//   return value;
// }

// module.exports = {
//   port: Number(process.env.PORT) || 5001,

//   nodeEnv: process.env.NODE_ENV || 'development',

//   clientOrigin:
//     process.env.CLIENT_ORIGIN || 'http://localhost:5173',

//   db: {
//     host: required('DB_HOST'),
//     port: Number(required('DB_PORT')),
//     user: required('DB_USER'),
//     password: required('DB_PASSWORD'),
//     database: required('DB_NAME'),
//   },

//   jwt: {
//     accessSecret: required(
//       'JWT_ACCESS_SECRET',
//       'dev_access_secret_change_me'
//     ),

//     refreshSecret: required(
//       'JWT_REFRESH_SECRET',
//       'dev_refresh_secret_change_me'
//     ),

//     accessExpiresIn:
//       process.env.JWT_ACCESS_EXPIRES_IN || '15m',

//     refreshExpiresIn:
//       process.env.JWT_REFRESH_EXPIRES_IN || '7d',
//   },

//   seedAdmin: {
//     username:
//       process.env.SEED_ADMIN_USERNAME || 'admin',

//     password:
//       process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',

//     fullName:
//       process.env.SEED_ADMIN_FULLNAME ||
//       'System Administrator',
//   },
// };

require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;

  if (value === undefined || value === '') {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

module.exports = {
  // Render provides PORT automatically
  port: Number(process.env.PORT) || 5001,

  nodeEnv: process.env.NODE_ENV || 'development',

  clientOrigin:
    process.env.CLIENT_ORIGIN ||
    'http://localhost:5173',

  // =====================================================
  // DATABASE
  // =====================================================

  db: {
    host: required('DB_HOST'),
    port: Number(required('DB_PORT')),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),

    // Aiven requires SSL
    ssl: process.env.DB_SSL !== 'false',
  },

  // =====================================================
  // JWT
  // =====================================================

  jwt: {
    accessSecret: required(
      'JWT_ACCESS_SECRET',
      'dev_access_secret_change_me'
    ),

    refreshSecret: required(
      'JWT_REFRESH_SECRET',
      'dev_refresh_secret_change_me'
    ),

    accessExpiresIn:
      process.env.JWT_ACCESS_EXPIRES_IN || '15m',

    refreshExpiresIn:
      process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // =====================================================
  // DEFAULT ADMIN
  // =====================================================

  seedAdmin: {
    username:
      process.env.SEED_ADMIN_USERNAME || 'admin',

    password:
      process.env.SEED_ADMIN_PASSWORD || 'ad12345',

    fullName:
      process.env.SEED_ADMIN_FULLNAME ||
      'System Administrator',
  },
};