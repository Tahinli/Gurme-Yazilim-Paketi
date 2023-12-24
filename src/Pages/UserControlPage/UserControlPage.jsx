import "./user.css";
import TextField from "@mui/material/TextField";
import logo from "../../assets/img/logo.png";
import Button from "@mui/material/Button";
import React, { useEffect, useRef, useState } from "react"; // Add useEffect here
import backgroundImage from "../../assets/img/photo.jpg";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import kullaniciApi from "../../api/user-api.js";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

function UserPage() {
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(false); // Yeni durum değişkeni
  const navigate = useNavigate();

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    kullaniciApi.deleteUser(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(
      rows.map((row) => {
        if (row.i === newRow.i) {
          kullaniciApi.updateUser(row.id, newRow);
          return updatedRow;
        }
        return row;
      })
    );

    alert("Kullanıcı Güncellendi");

    return updatedRow;
  };

  const handleSaveClick = (id) => () => {
    let row = rows.find((row) => row.id === id);
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await kullaniciApi.getUsers();
      let i = 0;
      const newRows = users.map((user) => {
        const rowData = createData(
          i,
          user.isim,
          user.soyisim,
          user.id,
          user.sifre
        );
        i++;
        return rowData;
      });

      setRows(newRows);
    };
    fetchUsers();
  }, [refresh]);

  const userRef = useRef();
  const [sifre, setPwd] = useState("");
  const [isim, setIsim] = useState("");
  const [soyisim, setSoyIsim] = useState("");
  const [id, setId] = useState("");
  function createData(i, isim, soyisim, id, sifre) {
    return { i, isim, soyisim, id, sifre };
  }
  const columns = [
    { field: "isim", headerName: "İsim", width: 200, editable: true },
    { field: "soyisim", headerName: "Soy İsim", width: 200, editable: true },
    { field: "id", headerName: "Kullancı Adi", width: 200, editable: true },
    {
      field: "sifre",
      headerName: "Şifre",
      width: 200,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Eylemler",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleButtonClick = async (e) => {
    e.preventDefault();
    const response = await kullaniciApi.addUser({ isim, soyisim, id, sifre });
    alert("Kullanıcı Eklendi");
    setRefresh((prev) => !prev); // refresh durumunu günceller
  };
  const handleButtonClick2 = (e) => {
    e.preventDefault();
    navigate("/");
  };
  const wrapperRef = useRef(null);

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
        <div>
          <div className="logodiv2">
            <img className="imglogo2" src={logo} alt="Logo" />
          </div>
          <div className="loginDiv2">
            <div className="textfield1">
              <TextField
                className="textf2"
                id="outlined-basic"
                label="İsim"
                variant="outlined"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setIsim(e.target.value)}
                required
              />

              <TextField
                className="textf2"
                id="outlined-basic"
                label=" Soyisim"
                variant="outlined"
                onChange={(e) => setSoyIsim(e.target.value)}
                required
              />
            </div>
            <div className="textfield2">
              <TextField
                className="textf2"
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
                className="textf2"
                id="outlined-basic"
                label="Şifre"
                variant="outlined"
                onChange={(e) => setPwd(e.target.value)}
                required
              />
            </div>

            <div
              className="tabletz"
              style={{ width: "90%", paddingLeft: "120px" }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                editMode="row"
                processRowUpdate={processRowUpdate}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                onProcessRowUpdateError={(error) => {
                  console.error(
                    "An error occurred while processing row update:",
                    error
                  );
                }}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
              />
            </div>
            <div className="buttonDiv2">
              <Button
                variant="contained"
                className="submitButton2"
                onClick={handleButtonClick}
              >
                Kayıt Ekle
              </Button>
              <Button
                variant="contained"
                className="submitButton2"
                onClick={handleButtonClick2}
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </div>
        </div>
      }{" "}
    </div>
  );
}

export default UserPage;
