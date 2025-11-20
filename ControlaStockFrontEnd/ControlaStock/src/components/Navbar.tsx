import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
    isLoggedIn: boolean;
    userEmail: string;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, userEmail, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to={isLoggedIn ? "/menu" : "/"}>
          <strong>ControlaStock</strong>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/menu">
                    Menu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/inventory">
                    Inventário
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Registrar
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  {userEmail}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
