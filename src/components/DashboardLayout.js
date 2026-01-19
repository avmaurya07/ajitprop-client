import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="ml-64 mt-16 p-6 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
