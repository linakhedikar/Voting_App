const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  //Extract the jwt token from the request header

  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Token not found" });
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    //verify the jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid token" });
  }
};

//function to generate token
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "30m" });
};

module.exports = { jwtAuthMiddleware, generateToken };
