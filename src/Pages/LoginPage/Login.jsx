import "./Login.css";
import TextField from "@mui/material/TextField";
import logo from "../../assets/img/logo.png";
import Button from "@mui/material/Button";
import React, { useRef, useState, useEffect, useContext } from "react"; // Add useEffect here
import backgroundImage from "../../assets/img/photo.jpg";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../AuthProvider";
import URL from "../../URL/server";
const LOGIN_URL = URL + "/auth";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const errRef = useRef();
  const userRef = useRef();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.alignItems = "center";

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

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleButtonClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = response?.data.accessToken;
      login(user, accessToken);
      navigate("/");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <div className="loginDiv">
      <div className="logodiv">
        <img className="imglogo" src={logo} alt="Logo" />
      </div>
      <div className="textfield">
        <TextField
          className="textf"
          id="outlined-basic"
          label="Kullanıcı Adı"
          variant="outlined"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          required
        />

        <br />
        <TextField
          type="password"
          className="textf"
          id="sifre"
          label="Şifre"
          variant="outlined"
          onChange={(e) => setPwd(e.target.value)}
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
        </Button>
      </div>
    </div>
  );
}

export default Login;
