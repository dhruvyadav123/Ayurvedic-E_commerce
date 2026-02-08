import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ toggle }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={toggle} className="md:hidden">
          <Menu />
        </button>
        <h2 className="text-xl font-semibold">Admin Panel</h2>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("isAdmin");
          navigate("/login");
        }}
        className="bg-green-700 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
}
