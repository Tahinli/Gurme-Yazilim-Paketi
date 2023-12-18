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
const LOGOUT_URL = "http://localhost:5000/logout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [verify, setVerify] = useState(false);
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
    verifyUser();
  };
  const verifyUser = async () => {
    const response = await fetch("http://localhost:5000/verify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    setVerify(response.status === 200);
    setVerify(!(response.status !== 200));

    return response.status;
  };
  const buttonClick = () => {
    navigate("/login");
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
        <div className="container">
          <nav className="navbar">
            <h1 className="header">ÇEMEN'S GURME</h1>
            <ul className="navbar_links">
              {verify && (
                <React.Fragment>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      className="login_menu"
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 2, paddingRight: 5 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <Avatar
                        className="login_btn"
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
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
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
                    <MenuItem onClick={handleClose}>
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
              {!verify && <button onClick={buttonClick}> Giriş Yap </button>}
            </ul>
          </nav>
        </div>
      </header>
      <img
        className="logo"
        src="/src/assets/img/cemens_logo.jpg"
        alt="Çemen's Gurme"
      ></img>
    </div>
  );
};

export default Navbar;
