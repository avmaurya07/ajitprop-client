import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/properties", label: "Properties", icon: "🏠" },
    // { path: "/users", label: "Users", icon: "👥" },
    { path: "/change-password", label: "Change Password", icon: "🔒" },
    // { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-40">
      <nav className="py-6">
        <ul className="list-none m-0 p-0">
          {menuItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 no-underline transition-all gap-3 hover:bg-gray-100 ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : ""
                }`}
              >
                <span className="text-lg w-6 text-center">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
