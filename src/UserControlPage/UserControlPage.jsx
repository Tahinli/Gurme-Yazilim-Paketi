import "./user.css";
import TextField from "@mui/material/TextField";
import logo from "../assets/img/logo.png";
import Button from "@mui/material/Button";
import React, { useEffect, useRef, useState } from "react"; // Add useEffect here
import backgroundImage from "../assets/img/photo.jpg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import kullaniciApi from "../api/user-api.js";
const UserPage = () => {
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
  const userRef = useRef();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [isim, setIsim] = useState("");

  const [soyIsim, setSoyIsim] = useState("");

  const handleButtonClick = async (e) => {
    e.preventDefault();
  };

  async function createData() {
    const result = await kullaniciApi.getUsers();
    console.log(result);

    return result;
  }

  const rows = [];
  return (
    <div>
      <div className="logodiv">
        <img className="imglogo" src={logo} alt="Logo" />
      </div>
      <div className="loginDiv">
        <div className="textfield">
          <TextField
            className="textf"
            id="outlined-basic"
            label="İsim"
            variant="outlined"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setIsim(e.target.value)}
            required
          />

          <TextField
            className="textf"
            id="outlined-basic"
            label=" Soyisim"
            variant="outlined"
            onChange={(e) => setSoyIsim(e.target.value)}
            required
          />
        </div>
        <div className="textfield2">
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

          <TextField
            type="password"
            className="textf"
            id="outlined-basic"
            label="Şifre"
            variant="outlined"
            onChange={(e) => setPwd(e.target.value)}
            required
          />
        </div>

        <div className="table">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>İsim</TableCell>
                  <TableCell align="center">Kullanıcı Adı</TableCell>
                  <TableCell align="center">Şifre</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.username}</TableCell>
                    <TableCell align="center">{row.password}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="buttonDiv"></div>
        </div>
        <div>
          <Button
            variant="contained"
            className="submitButton"
            onClick={handleButtonClick}
          >
            Kayıt Ekle
          </Button>
        </div>
      </div>
      );
    </div>
  );
};

export default UserPage;
