import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notification from "./Notification";
import UserLink from "./UserLink";
import { Menu, Bell } from "lucide-react";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);

  const handleLogout = () => setLogoutModalOpen(true);
  const confirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
  };
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const menuItems = [
    { text: 'Home', to: '/' },
    { text: 'Browse', to: '/browse' },
    //{ text: 'About', to: '/about' },
    { text: 'Social', to: '/social' },
    { text: 'Forum', to: '/forum' },
  ];

  return (
    <>
      {/* ================================
          NAVBAR
      ================================ */}
      <header
        className="sticky top-0 z-50 border-b-[3px] border-[#C08A5D]"
        style={{
          background: "#111827",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-350 items-center px-6 lg:px-10">
          {/* LOGO */}
          <Link
            to="/"
            className="shrink-0 text-[2rem] font-extrabold tracking-tight no-underline"
          >
            <span className="text-[#C08A5D]">P</span>
            <span className="text-white">Build</span>
          </Link>

          {/* DIVIDER */}
          <div className="mx-8 hidden h-8 w-px bg-white/15 lg:block shrink-0" />

          {/* DESKTOP NAV */}
          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {menuItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.text}
                  to={item.to}
                  className={`
                    rounded-lg px-5 py-2 text-[0.82rem] font-semibold tracking-wide
                    transition-all duration-200 no-underline
                    ${
                      active
                        ? "border border-[#C08A5D]/30 bg-[#C08A5D]/10 text-[#C08A5D]"
                        : "text-white/80 hover:text-[#C08A5D] hover:bg-white/5"
                    }
                  `}
                >
                  {item.text}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-4">
            {/* MOBILE BUTTON */}
            <button
              onClick={toggleDrawer(true)}
              className="rounded-lg p-1.5 text-white hover:bg-white/5 transition-colors lg:hidden"
            >
              <Menu size={24} />
            </button>

            {/* DESKTOP AUTH */}
            <div className="hidden items-center gap-4 lg:flex">
              {isLoggedIn ? (
                <>
                  {/* Bell with red dot */}
                  <div className="relative">
                    <Notification />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#C08A5D] ring-2 ring-[#111827] pointer-events-none" />
                  </div>

                  <UserLink userId={user?.id} name={user?.name} />

                  <button
                    onClick={() => setLogoutModalOpen(true)}
                    className="rounded-lg border border-[#C08A5D] px-5 py-2 text-[0.875rem] font-semibold text-[#C08A5D] transition-all duration-200 hover:bg-[#C08A5D] hover:text-[#0F172A]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="rounded-lg border border-[#C08A5D] px-5 py-2 text-[0.875rem] font-semibold text-[#C08A5D] no-underline transition-all duration-200 hover:bg-[#C08A5D] hover:text-[#0F172A]"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================================
          MOBILE DRAWER
      ================================ */}
      <div
        className={`
          fixed inset-0 z-100 lg:hidden transition-all duration-300
          ${drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={toggleDrawer(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`
            absolute right-0 top-0 h-full w-62.5
            border-l border-white/10
            transition-transform duration-300
            ${drawerOpen ? "translate-x-0" : "translate-x-full"}
          `}
          style={{ background: "#111827" }}
        >
          <ul className="list-none m-0 p-0 pt-3">
            {menuItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <li key={item.text}>
                  <Link
                    to={item.to}
                    onClick={toggleDrawer(false)}
                    className={`
                      flex items-center border-b border-white/6 px-5 py-4
                      text-sm font-medium no-underline transition-all duration-200
                      ${
                        active
                          ? "bg-[#C08A5D]/15 text-[#C08A5D]"
                          : "text-[#DCD7C9] hover:bg-[rgba(192,138,93,0.08)] hover:text-[#C08A5D]"
                      }
                    `}
                  >
                    {item.text}
                  </Link>
                </li>
              );
            })}

            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to={`/profile/${user?.id}`}
                    onClick={toggleDrawer(false)}
                    className="flex items-center border-b border-white/6 px-5 py-4 text-sm font-medium text-[#C08A5D] no-underline  transition-all"
                  >
                    {user?.name}'s Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setLogoutModalOpen(true);
                      toggleDrawer(false)();
                    }}
                    className="w-full text-left px-5 py-4 text-sm font-medium text-[#ff6b6b] hover:bg-[rgba(255,107,107,0.08)] transition-all"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="mt-2 border-t border-[rgba(162,123,92,0.3)]">
                <Link
                  to="/auth"
                  onClick={toggleDrawer(false)}
                  className="flex items-center px-5 py-4 text-sm font-semibold text-[#C08A5D] no-underline hover:bg-[rgba(192,138,93,0.08)] transition-all"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* ================================
          LOGOUT CONFIRMATION MODAL
      ================================ */}
      <div
        className={`
          fixed inset-0 z-[200] flex items-center justify-center transition-all duration-300
          ${logoutModalOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setLogoutModalOpen(false)}
        />

        {/* Modal */}
        <div
          className="relative z-10 w-80 rounded-xl border border-white/10 p-6 text-center"
          style={{ background: "#1f2937" }}
        >
          <h3 className="mb-2 text-xl font-bold text-white">Logout</h3>
          <p className="mb-6 text-sm text-white/70">
            Are you sure you want to log out?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="rounded-lg border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition-all hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="rounded-lg bg-[#C08A5D] px-5 py-2 text-sm font-semibold text-[#0F172A] transition-all hover:bg-[#b07a4e]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
