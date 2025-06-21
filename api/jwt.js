const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || 'default_secret_change_this';

function signJwt(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "2h" });
}

function verifyJwt(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

module.exports = { signJwt, verifyJwt };
