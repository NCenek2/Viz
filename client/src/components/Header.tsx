import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const Header = () => {
  const { auth } = useAuth();
  const logout = useLogout();
  const role = auth?.userInfo?.role ?? 0;

  const logButton = (
    <li className="nav-item">
      {auth ? (
        <button
          className="nav-link"
          data-bs-dismiss="offcanvas"
          onClick={() => logout()}
        >
          <Link className="nav-link text-white" to="/login">
            Log Out
          </Link>
        </button>
      ) : (
        <button className="nav-link" data-bs-dismiss="offcanvas">
          <Link className="nav-link text-white" to="/login">
            Login
          </Link>
        </button>
      )}
    </li>
  );

  const role1Links = role >= 1 && (
    <>
      <li className="nav-item">
        <button className="nav-link" data-bs-dismiss="offcanvas">
          <Link className="nav-link text-white" to="/rankings">
            Rankings
          </Link>
        </button>
      </li>
      <li className="nav-item">
        <button className="nav-link" data-bs-dismiss="offcanvas">
          <Link className="nav-link text-white" to="/reports">
            View Reports
          </Link>
        </button>
      </li>
    </>
  );

  const role2Links = role >= 2 && (
    <>
      <li className="nav-item">
        <button className="nav-link" data-bs-dismiss="offcanvas">
          <Link
            className="nav-link white-smoke"
            aria-current="page"
            to="/r2/dashboard"
          >
            Dashboard
          </Link>
        </button>
      </li>
      <li className="nav-item">
        <button className="nav-link" data-bs-dismiss="offcanvas">
          <Link
            className="nav-link white-smoke"
            aria-current="page"
            to="/r2/reports"
          >
            Write Reports
          </Link>
        </button>
      </li>
      <li className="nav-item">
        <button className="nav-link" data-bs-dismiss="offcanvas">
          <Link
            className="nav-link white-smoke"
            aria-current="page"
            to="/r2/createcycle"
          >
            Create Cycle
          </Link>
        </button>
      </li>
      <li className="nav-item">
        <button className="nav-link" data-bs-dismiss="offcanvas">
          <Link
            className="nav-link white-smoke"
            aria-current="page"
            to="/r2/changecycle"
          >
            Change Cycle
          </Link>
        </button>
      </li>
      <li className="nav-item">
        <button className="nav-link" data-bs-dismiss="offcanvas">
          <Link
            className="nav-link white-smoke"
            aria-current="page"
            to="/r2/metrics"
          >
            Metrics
          </Link>
        </button>
      </li>
      <li className="nav-item">
        <button className="nav-link" data-bs-dismiss="offcanvas">
          <Link
            className="nav-link white-smoke"
            aria-current="page"
            to="/r2/access"
          >
            Access
          </Link>
        </button>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-dark header-color sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          Viz
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end sidebar-color"
          tabIndex={-1}
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
              Menu
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <button className="nav-link" data-bs-dismiss="offcanvas">
                  <Link
                    className="nav-link white-smoke"
                    aria-current="page"
                    to="/home"
                  >
                    Home
                  </Link>
                </button>
              </li>
              {role1Links}
              {role2Links}
              {logButton}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
