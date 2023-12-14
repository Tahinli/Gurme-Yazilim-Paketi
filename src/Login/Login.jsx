import "./Login.css";
import TextField from "@mui/material/TextField";
import logo from "../assets/img/logo.png";
import Button from "@mui/material/Button";
import React, { useRef, useState, useEffect } from "react"; // Add useEffect here
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/img/photo.jpg";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
let isVerified;

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{8,24}$/;
function Login() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setuser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setpwdFocus] = useState(false);

  const [matchpwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

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
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  usetffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidmatch(match);
  }, (pwd, matchPwd));

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const [isVerified, setIsVerified] = useState();
  const [isntVerified, setIsntVerified] = useState(true);

  const navigate = useNavigate();

  async function controlLogin2() {
    await setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  async function controlLogin() {
    if (username === "admin" && password === "123") {
      setLoginState("Giriş Başarılı");
      setIsVerified(true);
    } else {
      setIsntVerified(false);
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
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
          </section>
        </div>
        <div className="textfield">
          <TextField
            className="textf"
            id="outlined-basic"
            label="Kullanıcı Adı"
            variant="outlined"
            ref={userRef}
            autoComplete="off"
            value={username}
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
          />
          <p
            id="uidnote"
            className={
              userFocus && user && !validName ? "instructions" : "offscreen"
            }
          >
            {" "}
            <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 ¢haracters.
            <br /> Must begin with a letter.
            <br /> Letters, numbers, underscores, hyphens allowed.
          </p>

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
                navigate("/");
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
export { isVerified };
