import "./Login.css";
import TextField from "@mui/material/TextField";
import logo from "../assets/img/logo.png";
import Button from "@mui/material/Button";
import React, { useState } from "react";

function Login() {
  // Use state to manage the password
  const [password, setPassword] = useState("");
  let isAuthenticated = false;
  function controlPassword() {
    if (password === "123") {
      isAuthenticated = true;
      alert(isAuthenticated);
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
          />
          <br />
          <TextField
            type="password"
            className="textf"
            id="sifre"
            label="Şifre"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update the password state on input change
            required
          />
        </div>
        <br />
        <div className="buttonDiv">
          <Button
            variant="contained"
            className="submitButton"
            onClick={controlPassword}
          >
            Giriş Yap
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
