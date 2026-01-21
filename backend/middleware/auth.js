const jwt = require("jsonwebtoken");

// Middleware to verify JWT token from Authorization header
// Extracts token, verifies it, and adds user data to request object
const auth = (req, res, next) => {
  // Extract token from "Authorization: Bearer <token>" header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token provided, reject request with 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token signature using JWT_SECRET env variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded user data (user id) to request for use in route handlers
    req.user = decoded;
    // Continue to next middleware/route handler
    next();
  } catch (err) {
    // If token is invalid or expired, reject with 401
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
