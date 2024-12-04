import { Link } from "react-router-dom";
import React from "react";
import "./NavBar.css";

interface NavBarProps {
  isAuthenticated: boolean;
}

export const NavBar = (props: NavBarProps) => {
  const linksWhenUserIsAuthenticated = (
    <>
      {props.isAuthenticated && (
        <>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/stats">Moje Statystyki</Link>
          </li>
          <li>
            <Link to="/logout">Wyloguj</Link>
          </li>
        </>
      )}
    </>
  );

  const loginLink = (
    <>
      {!props.isAuthenticated && (
        <li>
          <Link to="/login">Zaloguj</Link>
        </li>
      )}
    </>
  );
  return (
    <header className="NavBar">
      <nav>
        <ul>
          <li>
            <Link to="/courses">Kursy</Link>
          </li>
          {linksWhenUserIsAuthenticated}
          {loginLink}
        </ul>
      </nav>
    </header>
  );
};
