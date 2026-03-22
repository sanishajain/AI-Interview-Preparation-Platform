import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import "../css/layout.css";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="brand" onClick={handleLogoClick}>
          <span className="brand__logo" aria-hidden="true">🚀</span>
          <span className="brand__text">AI Interview Coach</span>
        </button>

        {!isAuthPage && (
          <nav className="nav">
            <Link to="/dashboard" className="nav__link">
              Dashboard
            </Link>
            <Link to="/interview" className="nav__link">
              Interview
            </Link>
            <Link to="/result" className="nav__link">
              Results
            </Link>
          </nav>
        )}
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <span>© {new Date().getFullYear()} AI Interview Coach</span>
        <span>Built for practice & preparation</span>
      </footer>
    </div>
  );
}
