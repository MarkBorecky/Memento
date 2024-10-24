import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AppHeader.css";
import icon from "../logo.svg";
import { Layout, Menu, Dropdown } from "antd";
import { HomeOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";

const { Header } = Layout;

interface User {
  name: string;
  username: string;
}

interface AppHeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  isAuthenticated: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  currentUser,
  onLogout,
  isAuthenticated,
}) => {
  const location = useLocation();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      onLogout();
    }
  };

  const menuItems = currentUser ? (
    <>
      <Menu.Item key="/">
        <Link to="/">
          <HomeOutlined className="nav-icon" />
        </Link>
      </Menu.Item>
      <Menu.Item key="/poll/new">
        <Link to="/poll/new">
          <img src={icon} alt="poll" className="poll-icon" />
        </Link>
      </Menu.Item>
      <Menu.Item key="profile" className="profile-menu">
        <ProfileDropdownMenu
          currentUser={currentUser}
          handleMenuClick={handleMenuClick}
        />
      </Menu.Item>
    </>
  ) : (
    <>
      <Menu.Item key="/login">
        <Link to="/login">Login</Link>
      </Menu.Item>
      <Menu.Item key="/signup">
        <Link to="/signup">Signup</Link>
      </Menu.Item>
    </>
  );

  return (
    <Header className="app-header">
      <div className="container">
        <div className="app-title">
          <Link to="/">Polling App</Link>
        </div>
        <Menu
          className="app-menu"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ lineHeight: "64px" }}
        >
          {menuItems}
        </Menu>
      </div>
    </Header>
  );
};

interface ProfileDropdownMenuProps {
  currentUser: User;
  handleMenuClick: (menu: { key: string }) => void;
}

const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
  currentUser,
  handleMenuClick,
}) => {
  const dropdownMenu = (
    <Menu onClick={handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">{currentUser.name}</div>
        <div className="username-info">@{currentUser.username}</div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${currentUser.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  const getPopupContainer = () => {
    const profileMenuElement =
      document.getElementsByClassName("profile-menu")[0];
    return profileMenuElement as HTMLElement; // Cast to HTMLElement
  };

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={["click"]}
      getPopupContainer={getPopupContainer}
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        <UserOutlined className="nav-icon" style={{ marginRight: 0 }} />{" "}
        <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default AppHeader;
