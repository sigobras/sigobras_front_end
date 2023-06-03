import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import SideNav from "../molecules/SideNav/SideNav";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LoginButton from "./LoginButton";
import ContactButton from "./ContactButton";
import LogoutButton from "./LogoutButton";
import { useRouter } from "next/router";
import { logout } from "../../redux/actions/auth";
const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const Layout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && router.pathname !== "/") {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Despacha la acción de cierre de sesión
    sessionStorage.clear();
    router.push("/"); // Navega a la página de inicio con Next.js
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {isLoggedIn ? (
        <>
          <AppBar position="fixed" open={open}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Box display="flex" alignItems="center">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    marginRight: 5,
                    ...(open && { display: "none" }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  Sigobras
                </Typography>
              </Box>
              <LogoutButton handleLogout={handleLogout} />
            </Toolbar>
          </AppBar>
          <SideNav
            handleDrawerClose={handleDrawerClose}
            drawerWidth={drawerWidth}
            DrawerHeader={DrawerHeader}
            open={open}
          />
          <Box component="main" >
            <DrawerHeader />
            {children}
          </Box>
        </>
      ) : (
        <>
          <AppBar position="fixed">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Image
                  src="/images/logo.jpg"
                  alt="login sigobras"
                  width={100}
                  height={50}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <ContactButton />
                <LoginButton />
              </Box>
            </Toolbar>
          </AppBar>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            {children}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Layout;
