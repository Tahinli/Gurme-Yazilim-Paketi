import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import ServerURL from "../../../../URL/server";
const LOGOUT_URL = ServerURL + "/logout";
const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [verify, setVerify] = useState(false);
  const [verify1, setVerify1] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    const response = await axios.post(
      LOGOUT_URL,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    navigate("/");
    await verifyUser();
  };
  const verifyUser = async () => {
    const response = await fetch(ServerURL + "/verify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    setVerify(response.status === 200);
    setVerify1(response.status !== 200);
  };
  const buttonClick = () => {
    navigate("/login");
  };
  const handleUyeEkle = () => {
    navigate("/user");
  };
  useEffect(() => {
    verifyUser();
   }, []);

  return (
    <div>
      <header className="bg-light-green">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        ></link>
        <div>
          <nav className="navbar">
            <div style={{ width: "20%", textAlign: "end", flexGrow: 0.56 }}>
              <h1 className="header">ÇEMEN'S GURME</h1>
            </div>

            <ul>
              <div className="navbar_rightbox">
                <img
                  className="logo"
                  src="/src/assets/img/cemens_logo.jpg"
                  alt="Çemen's Gurme"
                ></img>

                {verify && (
                  <React.Fragment>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                        marginRight: -1.5,
                      }}
                      className="login_lpart"
                    >
                      <IconButton
                        className="login_menu"
                        onClick={handleClick}
                        size="small"
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <Avatar
                          className="login_symbol"
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#305630",
                          }}
                        ></Avatar>
                      </IconButton>
                    </Box>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&:before": {
                            content: '""',
                            display: "flex",
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleUyeEkle();
                        }}
                      >
                        <ListItemIcon>
                          <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Üye Ekle
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleClose();
                          handleLogout();
                        }}
                      >
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Çıkış
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                )}
                {verify1 && (
                  <Button
                    className="login_button"
                    color="error"
                    variant="contained"
                    aria-label="add"
                    onClick={buttonClick}
                    startIcon={<LoginIcon />}
                  >
                    GİRİŞ YAP
                  </Button>
                )}
              </div>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
