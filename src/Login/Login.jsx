import "./Login.css";
import TextField from "@mui/material/TextField";
import logo from "../assets/img/logo.png";
import Button from "@mui/material/Button";

function Login() {
  return (
    <div className="loginDiv">
      <div className="mainDiv">
        <div className="logodiv">
          <img className="imglogo" src={logo} />
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
            id="outlined-basic"
            label="Şifre"
            variant="outlined"
            required
          />
        </div>
        <br />
        <div className="buttonDiv">
          <Button variant="contained" className="submitButton">
            Giriş Yap
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
