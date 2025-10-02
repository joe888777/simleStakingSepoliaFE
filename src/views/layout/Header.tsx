import React, { useEffect, useState } from "react";
import {
  AppBar, Toolbar, Box, Button, Menu, MenuItem, Avatar, Typography,
  CircularProgress, Divider
} from "@mui/material";
import { AccountCircle, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export interface MenuItemType {
  id: string;
  label: string;
  MenuPath?: string;
  children: MenuItemType[];
}

interface HeaderProps {
  token: string | null;
  setToken: (token: string | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  setMenuItems?: (items: MenuItemType[]) => void;
}

const Header: React.FC<HeaderProps> = ({ token, setToken, username, setUsername, setMenuItems }) => {
  const navigate = useNavigate();
  const address = useAddress();
  const [menuItems, setLocalMenuItems] = useState<MenuItemType[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<MenuItemType | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);

  const buildMenuHierarchy = (flatMenu: any[]): MenuItemType[] => {
    const map: { [id: string]: MenuItemType } = {};
    const roots: MenuItemType[] = [];
    flatMenu.forEach((item) => {
      const fallbackPath = `/${item.menuName?.toLowerCase().replace(/\s+/g, "-")}`;
      map[item.menuId] = {
        id: item.menuId,
        label: item.menuName || "No Label",
        MenuPath: item.menuUrl || fallbackPath,
        children: [],
      };
    });
    flatMenu.forEach((item) => {
      if (item.parentMenuId) {
        const parent = map[item.parentMenuId];
        if (parent) parent.children.push(map[item.menuId]);
      } else {
        roots.push(map[item.menuId]);
      }
    });
    return roots;
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        const payload: any = { Platform: "frontendweb" };
        const userId = localStorage.getItem("userId");
        const roleId = localStorage.getItem("roleId");
        if (userId) payload.UserID = userId;
        if (roleId) payload.RoleID = roleId;
        const res = await api.post("/Menuhierachy/menus", payload);
        if (res.data && Array.isArray(res.data)) {
          const nestedMenu = buildMenuHierarchy(res.data);
          setLocalMenuItems(nestedMenu);
          setMenuItems?.(nestedMenu);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, [setMenuItems]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: MenuItemType) => {
    setMenuAnchor(event.currentTarget);
    setOpenSubMenu(item);
  };

  const handleMenuClose = () => {
    setOpenSubMenu(null);
    setMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    setToken(null);
    setUsername(null);

    navigate("/");
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#000", color: "#e3c78b" }}>
        <Toolbar sx={{ justifyContent: "space-evenly" }}>
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
            <img
              src="https://happy-mushroom-05bf0a900.6.azurestaticapps.net/headerlogo.db668e0f.png"
              alt="Logo"
              style={{ height: "3rem", marginRight: 16 }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {loadingMenu ? (
              <CircularProgress size={24} sx={{ color: "#e3c78b" }} />
            ) : (
              <>
                {menuItems.map((item) => (
                  <Box key={item.id}>
                    <Button
                      sx={{ color: "#e3c78b" }}
                      onMouseEnter={(e) => item.children.length > 0 && handleMenuOpen(e, item)}
                      onClick={() => item.MenuPath && navigate(item.MenuPath)}
                    >
                      {item.label}
                    </Button>
                    {item.children.length > 0 && menuAnchor && openSubMenu?.id === item.id && (
                      <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor && openSubMenu?.id === item.id)}
                        onClose={handleMenuClose}
                        PaperProps={{ sx: { bgcolor: "#000", color: "#e3c78b" } }}
                        MenuListProps={{ sx: { p: 0 }, onMouseLeave: handleMenuClose }}
                      >
                        {item.children.map((sub, index) => (
                          <MenuItem
                            key={sub.id}
                            onClick={() => { if (sub.MenuPath) navigate(sub.MenuPath); handleMenuClose(); }}
                            sx={{
                              color: "#e3c78b",
                              borderBottom: index === item.children.length - 1 ? "none" : "0.5px solid #fff",
                              "&:hover": { bgcolor: "#161821" },
                              padding: "8px 24px",
                            }}
                          >
                            {sub.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </Box>
                ))}
                <Button
                  sx={{ color: "#e3c78b" }}
                  onClick={() => navigate("/amgt")}
                >
                  AMGT
                </Button>
                {!token && (
                  <Button
                    sx={{
                      color: "#000",
                      backgroundColor: "#e3dda4 !important",
                      fontWeight: "bold",
                      "&:hover": { backgroundColor: "#d4c77f !important" },
                    }}
                    onClick={() => navigate("/auth")}
                  >
                    Login / Sign Up
                  </Button>
                )}
              </>
            )}
          </Box>

          {token && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ConnectWallet />
              <Avatar
                sx={{ bgcolor: "#e3c78b", color: "#000", fontWeight: "bold", cursor: "pointer" }}
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
              >
                {username?.[0]?.toUpperCase() || "U"}
              </Avatar>
              {userMenuAnchor && (
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={() => setUserMenuAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{ sx: { bgcolor: "#000", color: "#e3c78b", minWidth: 200 } }}
                >
                  <MenuItem onClick={() => { navigate("/myaccount"); setUserMenuAnchor(null); }}>
                    <AccountCircle sx={{ mr: 1 }} /> My Account
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
