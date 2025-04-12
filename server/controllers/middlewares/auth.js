import jwt from "jsonwebtoken";
import config from "config";


const JWT_SECRET = config.get("JWT_SECRET");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "Authorization denied, no token provided" });
    }

    // Remove 'Bearer ' prefix if present
    const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

    const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export default authMiddleware;



