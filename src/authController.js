import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = "sdaA";
const REFRESH_TOKEN_SECRET = "dsada";
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
      expiresIn: "30days",
    });
    const refreshToken = jwt.sign({ username: "admin" }, REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return res
      .cookie("auth", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Logged in successfully " });
  }
};
const authenticateToken = async (req, res) => {
  const accessToken = await req.cookies.auth;
  if (!accessToken) {
    return res.sendStatus(403);
  }
  try {
    const data = await jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.username = data.username;
    return res.status(200).send("Authentication successful");
  } catch (error) {
    console.error(error);
    return res.sendStatus(403);
  }
};

export { authenticateToken }; // Export the authenticateToken function
export { handleLogin }; // Export the handleLogin function