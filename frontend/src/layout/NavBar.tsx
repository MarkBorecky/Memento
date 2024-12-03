import { Link } from "react-router-dom";
import React from "react";
import "./NavBar.css";

interface NavBarProps {
  isAuthenticated: boolean;
}

export const NavBar = (props: NavBarProps) => {
  return (
      <header className="NavBar" >
          <nav>
              <ul>
                  {props.isAuthenticated && (
                      <>
                          <li><Link to="/dashboard">Dashboard</Link></li>
                          <li><Link to="/stats">Moje Statystyki</Link></li>
                          <li><Link to="/logout">Wyloguj</Link></li>
                      </>
                  )}
                  <li><Link to="/courses">Kursy</Link></li>
                  {!props.isAuthenticated && (
                      <li><Link to="/login">Zaloguj</Link></li>
                  )}
              </ul>
          </nav>
      </header>
  );
};
