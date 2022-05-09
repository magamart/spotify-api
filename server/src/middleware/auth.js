const Jwt = require("../services/jwtService");
const { ApiResponse } = require("../models/responseModel");

const jwtService = new Jwt();

module.exports = verifyUser = (req, res, next) => {
  try {
    const token = req?.headers?.authorization || req?.headers?.Authorization;
    if (!token) {
      return res.status(403).send(new ApiResponse(403, null, "Token required"));
    }
    const user = jwtService.verifyToken(token);
    if (!user) {
      return res.status(401).send(new ApiResponse(401, null, "Invalid token"));
    }
    user.token = token;
    req.user = user;
    return next();
  } catch (error) {
    console.log({ error });
    return res.status(401).send(new ApiResponse(401, null, "Invalid token"));
  }
};
