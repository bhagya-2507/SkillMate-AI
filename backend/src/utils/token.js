const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET || 'skillmate_ai_jwt_secret_token_key_development_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'skillmate_ai_jwt_secret_token_key_development_2026'
  );
};

module.exports = {
  generateToken,
  verifyToken
};
