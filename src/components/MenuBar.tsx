import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { User } from "interfaces/User";
import useAuthSession from "hooks/useAuthSession";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "./DefaultAvatar";
import { jwtDecode } from "jwt-decode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import titleImage from "../assets/title.png";

interface MenuBarProps {
    user: User | null;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

export default function MenuBar({ user, darkMode, setDarkMode }: MenuBarProps) {
  const [anchorUserMenu, setAnchorUserMenu] = useState<null | HTMLElement>(null);
  const {token, logout} = useAuthSession();
  let navigate = useNavigate();

  const decodedToken: any = token ? jwtDecode(token) : null;
  const isAdmin = decodedToken?.realm_access.roles.includes("admin") ?? false;

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorUserMenu(null);
  };

  const handleAddItem = () => {
    navigate("/item/add");
  }

  const handleProfile = () => {
    setAnchorUserMenu(null);
    navigate("/profile");
  }
  
  const handleAdmin = () => {
    setAnchorUserMenu(null);
    navigate("/admin");
  }

  const handleStorefront = () => {
    setAnchorUserMenu(null);
    navigate(`/seller/${user?.cip}`);
  }

  const handleMessages = () => {
    setAnchorUserMenu(null);
    navigate("/message");
  }

  const handleLogout = () => {
    logout();
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container style={{ maxWidth: 3000}}>
          <Toolbar disableGutters sx={{ width: "100%", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={titleImage}
                alt="Logo"
                style={{ width: "40%", height: "100%", cursor: "pointer", objectFit: "contain" }}
                onClick={() => navigate("/search")}
              />
            </Box>
            {user !== null ? (
              <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit" sx={{ ml: 1, mr: 2 }}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                <Button variant="contained" sx={{ mt: 0.5, mb: 0.5, mr: 2, textTransform: "none", borderRadius: 3, backgroundColor: "primary.main" }} onClick={handleAddItem}>
                    + Ajouter un item
                </Button>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Ouvrir options">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <DefaultAvatar
                        width={42}
                        height={42}
                        primaryColor={false}
                        initials={user?.firstName[0] + user?.lastName[0]}
                        fullName={user?.firstName + " " + user?.lastName}
                        profilePictureUrl={user?.profilePictureUrl}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorUserMenu}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorUserMenu)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleProfile}>Profil</MenuItem>
                    <MenuItem onClick={handleStorefront}>Mon étalage</MenuItem>
                    <MenuItem onClick={handleMessages}>Messages</MenuItem>
                    {isAdmin && (
                      <MenuItem onClick={handleAdmin}>Admin - Tableau de bord</MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                  </Menu>
                </Box>
              </Box>
            ) : (
              <Box sx={{display: "flex", alignItems: "center", ml: "auto"}}>
                <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit" sx={{ ml: 1, mr: 2 }}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                <Button variant="contained" sx={{ mt: 0.5, mb: 0.5, mr: 2, textTransform: "none", borderRadius: 3, backgroundColor: "primary.main" }} href="/login">
                  Se connecter
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
