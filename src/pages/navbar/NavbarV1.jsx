import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  LayoutDashboard,
  Moon,
  Network,
  Sun,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { ROLE_NAV_ITEMS, ROLE_ROUTES } from "../../routes/roleRoutes.js";
import Notifications from "../../components/Notifications.jsx";
import "./NavbarV1.css";

const navItems = [
  {
    href: "#explore-jobs",
    icon: "fa-palette",
    tone: "cyan",
    label: "Creative Jobs",
  },
  {
    href: "#bounty-calculator",
    icon: "fa-calculator",
    tone: "pink",
    label: "Bounty Calculator",
  },
  {
    href: "#global-headhunter",
    icon: "fa-globe",
    tone: "green",
    label: "Earn Bounty",
  },
  {
    href: "#portfolio-showcase",
    label: "Talent Pool",
  },
];

function getRoleNavIcon(label) {
  if (/dashboard|statistics/i.test(label)) return LayoutDashboard;
  if (/jobs/i.test(label)) return BriefcaseBusiness;
  if (/candidates|users/i.test(label)) return UsersRound;
  if (/saved/i.test(label)) return Bookmark;
  if (/notifications/i.test(label)) return Bell;
  return LayoutDashboard;
}

export default function NavbarV1() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const accountRef = useRef(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const roleItems = ROLE_NAV_ITEMS[user?.role] || [];

  useEffect(() => {
    if (!accountMenuOpen) return undefined;

    const closeAccountMenu = (event) => {
      if (event.type === "keydown" && event.key === "Escape") {
        setAccountMenuOpen(false);
      } else if (
        event.type === "mousedown" &&
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeAccountMenu);
    document.addEventListener("keydown", closeAccountMenu);
    return () => {
      document.removeEventListener("mousedown", closeAccountMenu);
      document.removeEventListener("keydown", closeAccountMenu);
    };
  }, [accountMenuOpen]);

  useEffect(() => {
    if (!notificationsOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setNotificationsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [notificationsOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const dashboardPath =
    ROLE_ROUTES[user?.role]?.dashboard || ROLE_ROUTES[user?.role]?.jobs || "/";
  const profilePath = ROLE_ROUTES[user?.role]?.profile || null;
  const notificationsPath = ROLE_ROUTES[user?.role]?.notification || null;
  const isCurrentRoute = (path) =>
    location.pathname === path ||
    (path !== dashboardPath && location.pathname.startsWith(`${path}/`));

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    closeMobileMenu();
    navigate("/login");
  };

  return (
    <>
    <header className={`navbar-v1${user ? " navbar-v1--authenticated" : ""}`}>
      <div className="navbar-v1__inner">
        <a className="navbar-v1__brand" href="/" aria-label="ANT TECH home">
          <span className="navbar-v1__logo" aria-hidden="true">
            <Network size={19} strokeWidth={2} />
          </span>
          <span className="navbar-v1__brand-copy">
            <span className="navbar-v1__brand-name">
              ANT <span>TECH</span>
            </span>
            <span className="navbar-v1__tagline">
              {user?.role
                ? `${user.role === "lower_admin" ? "Lower admin" : user.role === "recruiter_freelancer" ? "Freelance recruiter" : user.role === "recruiter_fulltime" ? "Full-time recruiter" : user.role} workspace`
                : "Headhunter • Creative UI/UX"}
            </span>
          </span>
        </a>

        {!user ? (
          <nav className="navbar-v1__links" aria-label="Main navigation">
            {navItems.map(({ href, icon, tone, label }) => (
              <a
                className="navbar-v1__link"
                href={href}
                key={label}
                onClick={closeMobileMenu}
              >
                {icon && (
                  <i
                    className={`fa-solid ${icon} navbar-v1__link-icon navbar-v1__link-icon--${tone}`}
                    aria-hidden="true"
                  />
                )}
                {label}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="navbar-v1__role-links" aria-label="Workspace navigation">
            {roleItems.map((item) => {
              const RoleIcon = getRoleNavIcon(item.label);
              return (
                <Link
                  className={isCurrentRoute(item.path) ? "is-active" : ""}
                  key={item.path}
                  to={item.path}
                >
                  <RoleIcon className="navbar-v1__role-icon" size={16} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="navbar-v1__actions">
          {!user && (
            <>
              <button className="navbar-v1__referral" type="button">
                <i className="fa-solid fa-coins" aria-hidden="true" />
                <span>Refer &amp; Earn $1,500</span>
              </button>
              <button className="navbar-v1__portfolio" type="button">
                Post Portfolio
              </button>
            </>
          )}
          <button
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="navbar-v1__theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            type="button"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {user ? (
            <div className="navbar-v1__account" ref={accountRef}>
              {notificationsPath && (
                <button
                  aria-expanded={notificationsOpen}
                  aria-label="Open activity feed"
                  className={`navbar-v1__notification-link${notificationsOpen ? " is-active" : ""}`}
                  onClick={() => setNotificationsOpen(true)}
                  title="Activity feed"
                  type="button"
                >
                  <Bell size={17} aria-hidden="true" />
                </button>
              )}
              {roleItems.length === 0 && (
                <Link className="navbar-v1__dashboard-link" to={dashboardPath}>
                  Dashboard
                </Link>
              )}
              <button
                aria-expanded={accountMenuOpen}
                aria-label="Open account menu"
                className="navbar-v1__account-toggle"
                onClick={() => setAccountMenuOpen((open) => !open)}
                type="button"
              >
                <span className="navbar-v1__account-avatar" aria-hidden="true">
                  <UserRound size={17} />
                </span>
                <span className="navbar-v1__account-name">
                  {user.name || user.email || "Account"}
                </span>
                <i className="fa-solid fa-chevron-down" aria-hidden="true" />
              </button>
              {accountMenuOpen && (
                <div className="navbar-v1__account-menu">
                  {profilePath && (
                    <Link to={profilePath} onClick={() => setAccountMenuOpen(false)}>
                      My profile
                    </Link>
                  )}
                  {roleItems
                    .filter((item) => item.path !== dashboardPath)
                    .map((item) => (
                      <Link
                        className={isCurrentRoute(item.path) ? "is-active" : ""}
                        key={item.path}
                        onClick={() => setAccountMenuOpen(false)}
                        to={item.path}
                      >
                        {item.label}
                      </Link>
                    ))}
                  {roleItems.length === 0 && (
                    <Link to={dashboardPath}>Dashboard</Link>
                  )}
                  <button onClick={handleLogout} type="button">
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-v1__auth-links">
              <a className="navbar-v1__login-link" href="/login">
                Login
              </a>
              <a className="navbar-v1__signup-link" href="/signup">
                Sign Up
              </a>
            </div>
          )}
          <button
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="navbar-v1__menu-toggle"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            <i
              className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {!user && (
        <div className="navbar-v1__quick-actions" aria-label="Quick actions">
          <button className="navbar-v1__quick-action" type="button">
            Ai Matcher
          </button>
          <button className="navbar-v1__quick-action" type="button">
            Earn Money
          </button>
          <button className="navbar-v1__quick-action" type="button">
            ANT TOKEN
          </button>
        </div>
      )}
      {mobileMenuOpen && (
        <nav className="navbar-v1__mobile-menu" aria-label="Mobile navigation">
          {user ? (
            roleItems.map((item) => (
              <Link
                className={`navbar-v1__mobile-role-link ${isCurrentRoute(item.path) ? "is-active" : ""}`}
                key={item.path}
                onClick={closeMobileMenu}
                to={item.path}
              >
                {item.label}
              </Link>
            ))
          ) : (
            <>
              {navItems.map(({ href, icon, tone, label }) => (
                <a
                  className="navbar-v1__link"
                  href={href}
                  key={label}
                  onClick={closeMobileMenu}
                >
                  {icon && (
                    <i
                      className={`fa-solid ${icon} navbar-v1__link-icon navbar-v1__link-icon--${tone}`}
                      aria-hidden="true"
                    />
                  )}
                  {label}
                </a>
              ))}
              <button className="navbar-v1__referral" type="button">
                <i className="fa-solid fa-coins" aria-hidden="true" />
                <span>Refer &amp; Earn $1,500</span>
              </button>
            </>
          )}
          <button
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="navbar-v1__mobile-theme-toggle"
            onClick={toggleTheme}
            type="button"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            Switch to {theme === "dark" ? "light" : "dark"} theme
          </button>
          {user ? (
            <>
              {notificationsPath && (
                <button
                  className="navbar-v1__mobile-role-link"
                  onClick={() => {
                    closeMobileMenu();
                    setNotificationsOpen(true);
                  }}
                  type="button"
                >
                  <Bell size={16} aria-hidden="true" />
                  Activity Feed
                </button>
              )}
              <div className="navbar-v1__mobile-account">
                <div className="navbar-v1__mobile-account-info">
                  <span className="navbar-v1__account-avatar" aria-hidden="true">
                    {(user.name || user.email || "U").slice(0, 1).toUpperCase()}
                  </span>
                  <span>
                    <strong>{user.name || "Account"}</strong>
                    <small>{user.role || user.email}</small>
                  </span>
                </div>
                {profilePath && (
                  <Link to={profilePath} onClick={closeMobileMenu}>My profile</Link>
                )}
                <button onClick={handleLogout} type="button">Log out</button>
              </div>
            </>
          ) : (
            <div className="navbar-v1__mobile-auth">
              <a className="navbar-v1__login-link" href="/login" onClick={closeMobileMenu}>
                Login
              </a>
              <a className="navbar-v1__signup-link" href="/signup" onClick={closeMobileMenu}>
                Sign Up
              </a>
            </div>
          )}
        </nav>
      )}
    </header>
    {notificationsPath && (
      <Notifications
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    )}
    </>
  );
}
