import React from "react";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-7rem)]">
      <h1 className="text-4xl font-semibold text-gray-800 text-center">
        Welcome {user.fullName || "User"}
      </h1>
    </div>
  );
}

export default Dashboard;
