import "./Login.css";
import TextField from "@mui/material/TextField";
import logo from "../assets/img/logo.png";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react"; // Add useEffect here
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/img/photo.jpg";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function Login() {
  useEffect(() => {
    document.body.style.margin = "auto";
    document.body.style.minWidth = "320px";
    document.body.style.minHeight = "100vh";
    document.body.style.display = "flex";
    document.body.style.textAlign = "center";
    document.body.style.justifyContent = "center";
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    return () => {
      document.body.style.backgroundImage = "none";
    };
  }, []);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loginstate, setLoginState] = useState("false");
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  async function controlLogin2() {
    await setTimeout(() => {
      navigate("/home");
    }, 1000);
  }

  async function controlLogin() {
    if (username === "admin" && password === "123") {
      setLoginState("Giriş Başarılı");
      setIsVerified(true);
    }
  }

  const handleButtonClick = async () => {
    await controlLogin();
  };

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
            onClick={handleButtonClick}
          >
            Giriş Yap
            <Popup
              open={isVerified}
              onOpen={controlLogin2}
              closeOnDocumentClick
              closeOnEscape
              onClose={() => {
                navigate("/home");
              }}
            >
              <div className="popup">
                <div class="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div>
                  <p>{loginstate}</p>
                </div>
              </div>
            </Popup>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
