import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ProductPageAnalyze from "../../../Charts/ProductAnalyzePage/ProductAnalyzePage";
import { useNavigate } from "react-router-dom";
import { display } from "@mui/system";
import FoodBankIcon from "@mui/icons-material/FoodBank";

const drawerWidth = 270;
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 0.76,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,

    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth - 250,
    }),
    position: "relative",
  })
);

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideNavbar() {
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const handleClick1 = () => {
    window.location.replace(
        "/"
    );

  };
  const handleClick2 = () => {
    navigate("/data");
  };
  const handleClick3 = () => {
    navigate("/stock");
  };
  const handleClick4 = () => {
    navigate("/transportation");
  };
  const handleClick5 = () => {
    navigate("/product");
  };

  const handleDrawerOpen = () => {
    setOpen(!open);
  };
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <img
              className="header_img"
              src="/src/assets/img/cemens_resmi.jpg"
              width={30}
              height={20}
              alt="Çemen's Gurme"
            ></img>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          </DrawerHeader>

          <List
            className="sidebar"
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
              ></ListSubheader>
            }
          >
            <ListItemButton onClick={handleClick1}>
              <ListItemIcon>
                <HomeIcon sx={{ fontSize: 30 }} />
              </ListItemIcon>
              <ListItemText primary="Ana Sayfa" />
            </ListItemButton>

            <ListItemButton onClick={handleClick2}>
              <ListItemIcon>
                <NoteAltIcon sx={{ fontSize: 27 }} />
              </ListItemIcon>
              <ListItemText primary="Veri Girişi" />
            </ListItemButton>

            <ListItemButton onClick={handleClick3}>
              <ListItemIcon>
                <InventoryIcon sx={{ fontSize: 27 }} />
              </ListItemIcon>
              <ListItemText primary="Stok Takibi" />
            </ListItemButton>

            <ListItemButton onClick={handleClick4}>
              <ListItemIcon>
                <PlagiarismIcon sx={{ fontSize: 30 }} />
              </ListItemIcon>
              <ListItemText primary="Sevk Takibi" />
            </ListItemButton>

            <ListItemButton onClick={handleClick5}>
              <ListItemIcon>
                <FoodBankIcon sx={{ fontSize: 33 }} />
              </ListItemIcon>
              <ListItemText primary="Ürünler" />
            </ListItemButton>

            <img
              className="sideBar_img"
              src="/src/assets/img/cemens_cover.jpeg"
              alt="Çemen's Gurme"
            ></img>
          </List>
        </Drawer>

        <Main open={open} className="ProductAnalyze_containerbody">
          <ProductPageAnalyze />
        </Main>
      </Box>
    </div>
  );
}
