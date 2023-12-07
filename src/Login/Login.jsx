import "./Login.css";
import TextField from "@mui/material/TextField";
import logo from "../assets/img/logo.png";
import Button from "@mui/material/Button";
import React, { useState } from "react";

function Login() {
  // Use state to manage the password
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  let isAuthenticated = false;
  function controlLogin() {
    if (password === "123" && username === "admin") {
      isAuthenticated = true;
      alert("Giriş Başarılı");
    } else {
      isAuthenticated = false;
      alert("Giriş Başarısız");
    }
  }

  return (
    <div className="loginDiv">
      <div className="mainDiv">
        <div className="logodiv">
          <img className="imglogo" src={logo} alt="Logo" />
        </div>
        <div className="textfield">
          <TextField
            className="textf"
            id="outlined-basic"
            label="Kullanıcı Adı"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <TextField
            type="password"
            className="textf"
            id="sifre"
            label="Şifre"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <div className="buttonDiv">
          <Button
            variant="contained"
            className="submitButton"
            onClick={controlLogin}
          >
            Giriş Yap
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
