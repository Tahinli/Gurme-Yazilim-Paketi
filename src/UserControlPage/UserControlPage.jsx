import "./user.css";
import TextField from "@mui/material/TextField";
import logo from "../assets/img/logo.png";
import Button from "@mui/material/Button";
import React, { useEffect, useRef, useState } from "react"; // Add useEffect here
import backgroundImage from "../assets/img/photo.jpg";

import kullaniciApi from "../api/user-api.js";

import { DataGrid } from "@mui/x-data-grid";

function UserPage() {
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(false); // Yeni durum değişkeni

  useEffect(() => {
    const talha = async () => {
      const users = await kullaniciApi.getUsers();
      const newRows = users.map((user) =>
        createData(user.isim, user.soyisim, user.id, user.sifre)
      );
      setRows(newRows);
    };
    talha();
  }, [refresh]);
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
  const [sifre, setPwd] = useState("");
  const [isim, setIsim] = useState("");
  const [soyisim, setSoyIsim] = useState("");
  const [id, setId] = useState("");
  function createData(name, surname, id, password) {
    return { name, surname, id, password };
  }
  const columns = [
    { field: "name", headerName: "İsim", width: 200, editable: true },
    { field: "surname", headerName: "Soy İsim", width: 200, editable: true },
    { field: "id", headerName: "Kullancı Adi", width: 200, editable: true },
    {
      field: "password",
      headerName: "Şifre",
      width: 200,
      editable: true,
    },
  ];

  const handleButtonClick = async (e) => {
    e.preventDefault();
    const response = await kullaniciApi.addUser({ isim, soyisim, id, sifre });
    setRefresh((prev) => !prev); // refresh durumunu günceller
  };

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
            onChange={(e) => setId(e.target.value)}
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

        <div style={{ height: 400, width: "90%", paddingLeft: "100px" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
          <div className="buttonDiv">
            <Button
              variant="contained"
              className="submitButton"
              onClick={handleButtonClick}
            >
              Kayıt Ekle
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
