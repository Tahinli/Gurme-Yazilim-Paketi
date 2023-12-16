import express from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import { handleLogin, authenticateToken } from "./src/authController.js"; // Import the handleLogin function

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // or your allowedOrigins function
    credentials: true,
  })
);
app.use(cors(corsOptions));
app.use(express.json());
app.post("/auth", handleLogin);
app.get("/api/data", authenticateToken, (req, res) => {
  // Token doğrulama başarılıysa, devam eden işlemleri gerçekleştirin
  const user = req.user;
  res.json({ message: "API data", user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
