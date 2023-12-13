const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

function authenticateToken(req, res, next) {
  // Authorization başlığından token'ı al
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Token yoksa, 401 durumu döndür
  if (token == null) return res.sendStatus(401);

  // Token'ı doğrula
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // Token geçersizse, 403 durumu döndür
    if (err) return res.sendStatus(403);

    // Token geçerliyse, user bilgisini request'e ekle ve sonraki middleware fonksiyonuna geç
    req.user = user;
    next();
  });
}
app.get("/protected-route", authenticateToken, (req, res) => {
  // Eğer istek bu noktaya ulaştıysa, token geçerli demektir
  res.send("Protected content");
});

app.listen(5173, () => {
  console.log("Server is running on port 5173");
});
