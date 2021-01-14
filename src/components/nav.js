import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../App";
import { Logo } from "./logo";

export const NavBar = () => {
  return (
    <nav className="nav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/">
            <Logo />
          </Link>
        </li>
        <span className="action-icons">
          <li className="nav-item">
            <Link to="/add-profile">
              <img className="plus-icon" src="plus.svg" />
            </Link>
          </li>
          <li className="nav-item">
            {auth.currentUser ? (
              <img
                className="user-icon"
                src="user.svg"
                onClick={() => auth.signOut()}
              />
            ) : null}
          </li>
        </span>
      </ul>
    </nav>
  );
};
