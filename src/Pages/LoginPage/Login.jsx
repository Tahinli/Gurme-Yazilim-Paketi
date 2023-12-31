import "./Login.css";
import TextField from "@mui/material/TextField";
import logo from "../../assets/img/logo.png";
import Button from "@mui/material/Button";
import React, { useRef, useState, useEffect, useContext } from "react"; // Add useEffect here
import backgroundImage from "../../assets/img/photo.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ServerURL from "../../../URL/server";
const LOGIN_URL = ServerURL + "/auth";

function Login() {
  const wrapperRef = useRef(null);

  const navigate = useNavigate();

  const errRef = useRef();
  const userRef = useRef();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

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

      navigate("/");
    } catch (err) {
      if (!err?.response) {
        alert("No Server Response");
      } else if (err.response?.status === 400) {
        alert("Kullanıcı Adı Ve Şifre Girilmedi");
      } else if (err.response?.status === 401) {
        alert("Böyle Kullanıcı Bulunamadı");
      } else {
        alert("Login Failed");
      }
    }
  };
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.style.alignItems = "center";
      wrapper.style.minWidth = "320px";
      wrapper.style.minHeight = "100vh";
      wrapper.style.display = "flex";
      wrapper.style.textAlign = "center";
      wrapper.style.justifyContent = "center";
      wrapper.style.backgroundImage = `url(${backgroundImage})`;
    }
    return () => {
      if (wrapper) {
        wrapper.style.backgroundImage = "none";
      }
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      {" "}
      {
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
      }{" "}
    </div>
  );
}

export default Login;
