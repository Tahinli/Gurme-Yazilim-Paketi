import jwt from "jsonwebtoken";
import kullaniciApi from "./api/user-api.js";
import dotenv from "dotenv";
dotenv.config();

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  const dbuser = await kullaniciApi.getUserById(user);

  if (pwd == dbuser.sifre) {
    // create JWTs
    const accessToken = jwt.sign(
      { username: "admin" },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3h",
      }
    );
    const refreshToken = jwt.sign(
      { username: "token-id" },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
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
    const data = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.username = data.username;
    return res.status(200).send("Authentication successful");
  } catch (error) {
    console.error(error);
    return res.sendStatus(403);
  }
};

export { authenticateToken }; // Export the authenticateToken function
export { handleLogin }; // Export the handleLogin function
