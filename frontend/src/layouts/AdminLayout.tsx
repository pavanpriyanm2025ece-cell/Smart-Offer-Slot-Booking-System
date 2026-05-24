import type { ReactNode } from "react";
import { LayoutDashboard, Ticket, PlusCircle, ClipboardList, LogOut, Globe, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/offers", label: "Manage Offers", icon: <Ticket size={18} /> },
    { path: "/admin/create-offer", label: "Create Offer", icon: <PlusCircle size={18} /> },
    { path: "/admin/bookings", label: "Live Bookings", icon: <ClipboardList size={18} /> },
  ];

  return (
    <div className="flex min-h-screen text-slate-100 relative">
      {/* Decorative glows */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] rounded-full bg-indigo-950/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full bg-purple-950/15 blur-[120px] pointer-events-none" />

      {/* Sidebar Panel */}
      <aside className="w-68 bg-slate-950/60 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col justify-between shrink-0 hidden md:flex relative z-10">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">SmartOffer</h2>
              <span className="text-[9px] text-indigo-400 font-extrabold tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15 border-l-4 border-indigo-400"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-indigo-300 transition px-4 py-2"
          >
            <Globe size={16} />
            <span>Visit Client Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 px-4 py-3 rounded-xl w-full text-left transition"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Navbar */}
        <header className="glass-panel border-b border-white/5 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {navItems.find((n) => n.path === location.pathname)?.label || "Overview"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs bg-slate-900 border border-white/5 hover:border-indigo-500 text-slate-400 hover:text-slate-200 px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5"
            >
              <Globe size={14} />
              <span>Public Live</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs bg-rose-950/40 border border-rose-900/30 hover:bg-rose-900/40 text-rose-400 px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer md:hidden"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* View Content Workspace */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
