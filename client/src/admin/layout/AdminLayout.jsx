import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [open, setOpen] = useState(false); // mobile sidebar toggle

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          md:ml-64 overflow-auto`}
      >
        <Topbar toggle={() => setOpen(!open)} />

        <main className="p-6 w-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
