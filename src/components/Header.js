import React from "react";
import { logout } from "../utils/auth";

function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
      <div className="flex justify-between items-center h-full px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Ajit Properties Dashboard
          </h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">
              {user.fullName || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
