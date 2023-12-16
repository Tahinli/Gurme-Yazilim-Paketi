import express from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import { handleLogin, authenticateToken } from "./src/authController.js"; // Import the handleLogin function
import allowedOrigins from "./config/allowedOrigins.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: allowedOrigins, // or your allowedOrigins function
    credentials: true,
  })
);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.post("/auth", handleLogin);

app.get("/verify", authenticateToken, (req, res) => {
  return json({ username: req.username });
});

app.get("/logout", authenticateToken, (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "logged out" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
