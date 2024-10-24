import { Link } from "react-router-dom";
import React from "react";

interface NavBarProps {
  isAuthenticated: boolean
}

export const NavBar = (props: NavBarProps) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/courses">Kursy</Link>
        </li>
        {props.isAuthenticated && (
          <>
            <li>
              <Link to="/stats">Moje Statystyki</Link>
            </li>
            <li>
              <Link to="/logout">Wyloguj</Link>
            </li>
          </>
        )}
        {!props.isAuthenticated && (
            <li>
              <Link to="/login">Zaloguj</Link>
            </li>
        )}
      </ul>
    </nav>
  );
};
