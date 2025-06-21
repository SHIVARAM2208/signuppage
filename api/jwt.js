import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'default_secret_change_this';

export function signJwt(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "2h" });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
