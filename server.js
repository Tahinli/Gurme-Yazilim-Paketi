import express from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import { handleLogin, authenticateToken } from "./src/authController.js"; // Import the handleLogin function
import allowedOrigins from "./config/allowedOrigins.js";
import cookieParser from "cookie-parser";
import URL from "./src/URL/url.js";

const app = express();
const IP_ADDRESS = URL; // replace with your IP address
const PORT = process.env.PORT || 5000;

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

app.post("/logout", (req, res) => {
  res.clearCookie("auth").status(200).json({ message: "logged out" });
});
app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server is running on ${IP_ADDRESS}:${PORT}`);
});
