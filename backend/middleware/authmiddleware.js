const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decodes token and verifies using the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database
      req.user = await User.findById(decoded.id).select("-password");

      // If user doesn't exist
      if (!req.user) {
        res.status(404);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
