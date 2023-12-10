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
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    return () => {
      document.body.style.backgroundImage = "none";
    };
  }, []);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loginstate, setLoginState] = useState("false");

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function controlLogin() {
    if (password === "123" && username === "admin") {
      setLoginState("Giriş Başarılı");
    } else {
      setLoginState("Giriş Başarısız");
    }
  }

  const handleButtonClick = async () => {
    // Set the login state here
    await controlLogin();
    setIsOpen(true);
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
              open={isOpen}
              closeOnDocumentClick
              onClose={() => {
                setIsOpen(false);
                navigate("/home");
              }}
            >
              <div className="popup">{loginstate}</div>
            </Popup>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
