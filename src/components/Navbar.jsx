import React, { useState } from "react";
import { styled } from "styled-components";
import icon from "../assests/images/mustang.jpg";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Logout, Settings, Lock } from "@mui/icons-material";

function NavBar({ selected, user }) {
  const handleChangePassword = () => {
    handleClose();
    navigate("/changepassword");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const LogOutUser = () => {
    navigate("/");
    window.location.reload();
    localStorage.removeItem("data");
  };

  return (
    <NavBarContainer>
      <div id="nav-bar">
        <div id="nav-header">
          <div id="nav-image-head">
            <img src={icon} alt="logo" />
          </div>
        </div>
        <hr />
        <br />
        <div id="nav-user-img">
          <div id="img-sec">
            <img src={icon} alt="user" />
            <span>
              <b>ADMIN</b>
            </span>
          </div>
        </div>
        <br></br>
        <div className="scrol" id="nav-content">
          <NavItem
            isSelected={selected === "dashboard"}
            onClick={() => navigate("/dashboard")}
          >
            <span className="side-text">DASH BOARD</span>
          </NavItem>
          <NavItem
            isSelected={selected === "hosstaff"}
            onClick={() => navigate("/hosstaff")}
          >
            <span className="side-text">HO STAFF</span>
          </NavItem>
          <NavItem
            isSelected={selected === "franchise"}
            onClick={() => navigate("/franchise")}
          >
            <span className="side-text">FRANCHISE</span>
          </NavItem>
          <NavItem
            isSelected={selected === "vip"}
            onClick={() => navigate("/vip")}
          >
            <span className="side-text">VIP</span>
          </NavItem>
          <NavItem
            isSelected={selected === "sales"}
            onClick={() => navigate("/sales")}
          >
            <span className="side-text">OTHER SALES</span>
          </NavItem>
          <NavItem
            isSelected={selected === "fsales"}
            onClick={() => navigate("/fsales")}
          >
            <span className="side-text">FRANCHISE SALES</span>
          </NavItem>
          <NavItem
            isSelected={selected === "message"}
            onClick={() => navigate("/message")}
          >
            <span className="side-text">CEO MESSAGES</span>
          </NavItem>
          <NavItem isSelected={selected === ""}>
            <span className="side-text">
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <b style={{ color: "white" }}>SETTINGS</b>
                  <Settings fontSize="medium" sx={{ color: "pink" }} />
                </IconButton>
              </Tooltip>
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
                    bgcolor: "#25272d",
                    color: "#fff",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "#25272d",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Divider />
                <MenuItem onClick={handleChangePassword}>
                  <ListItemIcon>
                    <Lock fontSize="small" sx={{ color: "pink" }} />
                  </ListItemIcon>
                  Change Password
                </MenuItem>
                <MenuItem onClick={() => navigate("/settings")}>
                  <ListItemIcon>
                    <Settings fontSize="small" sx={{ color: "pink" }} />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={LogOutUser}>
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: "pink" }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </span>
          </NavItem>
        </div>
      </div>
    </NavBarContainer>
  );
}

const NavItem = styled.div`
  width: calc(100% - 16px);
  height: 50px;
  background-attachment: fixed;
  border-radius: 16px 0 0 16px;
  transition: top 0.2s;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding-left: 2rem;
  cursor: pointer;
  background: ${({ isSelected }) => (isSelected ? "#333" : "transparent")};
  color: ${({ isSelected }) => (isSelected ? "white" : "inherit")};

  &:hover {
    background: #444;
  }

  .side-text {
    font-family: Helvetica;
    font-size: medium;
    font-weight: 500;
    white-space: nowrap;
  }
`;

const NavBarContainer = styled.div`
background: #25272d;
  h6 {
    text-align: center;
  }

  html,
  body {
    margin: 0;
    background: #25272d;
  }

  #nav-bar {
    height: 100vh;
    width: 210px;
    left: 1vw;
    top: 1vw;
    background: #27252d;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    display: flex;
    flex-direction: column;
    color:#fff;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    overflow: hidden;
    user-select: none;
    z-index: 10rem;
  }

  @media only screen and (max-width: 999px) {
    #nav-bar {
      display: none;
    }
  }
  body::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  body::-webkit-scrollbar-thumb {
    border-radius: 99px;
    background-color: transparent;
  }
  body::-webkit-scrollbar-button {
    height: 16px;
  }

  .scrol::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .scrol::-webkit-scrollbar-thumb {
    border-radius: 99px;
    background-color: transparent;
  }
  .scrol::-webkit-scrollbar-button {
    height: 16px;
  }

  #nav-image-head {
    width: 100%;
    height: 4rem;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }

  #nav-image-head img {
    height: 90%;
    align-items: center;
  }
  hr {
    padding-left: 1rem;
    padding-right: 1rem;
    position: relative;
    border: none;
    height: 2px;
    width: 90%;
    align-items: center;
    background: black;
    margin-bottom: 20px;
    left: 3%;
  }
  #nav-user-img {
    display: flex;
    justify-content: center;
    height: 7rem;
    overflow: hidden;
  }
  #img-sec {
    position: relative;
    height: 100%;
    width: 7rem;
    overflow: hidden;
    border-radius: 100%;
    cursor: pointer;
  }
  #img-sec img {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  #img-sec span {
    position: absolute;
    color: white;
    bottom: -24px;
    font-size: 0.6rem;
    background-color: orange;
    width: 100%;
    height: 3rem;
    text-align: center;
    border-bottom-left-radius: 80%;
  }
  #nav-content {
    flex: 1;
    width: var(--navbar-width);
    background: var(--navbar-dark-primary);
    box-shadow: 0 0 0 16px var(--navbar-dark-primary);
    direction: rtl;
    overflow-x: hidden;
    transition: width 0.2s;
  }
`;

export default NavBar;
