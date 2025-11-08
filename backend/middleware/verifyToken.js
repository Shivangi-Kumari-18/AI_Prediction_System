import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role } aa jayega jo login me assign kiya tha
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};
