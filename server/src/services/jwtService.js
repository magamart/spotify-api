const jwt = require("jsonwebtoken");

const key = process.env.JWT_KEY || "sample_key";

class Jwt {
  generateToken(userData) {
    try {
      return jwt.sign({ ...userData }, key, { expiresIn: "4h" });
    } catch (error) {
      console.log({ error });
      return null;
    }
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, key);
    } catch ({ error }) {
      return null;
    }
  }
}

module.exports = Jwt;
