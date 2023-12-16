import jwt from "jsonwebtoken";
import { useContext } from "react";

const ACCESS_TOKEN_SECRET = "DSAD!^2ASDq@æßxcz₺₺DSA";
const REFRESH_TOKEN_SECRET = "DCSAKLcxKMLCW@!#%&/()=";
const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // Check if the user is 'admin' and password is '123'
  if (user === "admin" && pwd === "123") {
    // create JWTs
    const accessToken = jwt.sign({ username: "admin" }, ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });
    const refreshToken = jwt.sign({ username: "admin" }, REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ accessToken, refreshToken });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user; // Kullanıcı bilgilerini talep nesnesine ekleyin
    next(); // Middleware'i devam ettirin
  });
};
export { authenticateToken }; // Export the authenticateToken function

export { handleLogin }; // Export the handleLogin function
export default handleLogin;
