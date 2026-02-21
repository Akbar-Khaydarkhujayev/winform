import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  GraduationCap,
  LogOut,
} from "lucide-react";
import type { User } from "../types/auth";

interface SidebarProps {
  user: User;
}

const navItems = [
  { to: "/", label: "Qurilmalar", icon: LayoutDashboard },
  { to: "/locations", label: "Joylashuv", icon: MapPin },
  { to: "/students", label: "Abiturientlar", icon: GraduationCap },
  { to: "/objects", label: "Obyektlar", icon: Building2 },
];

export default function Sidebar({ user }: SidebarProps) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-card-bg border-r border-input-border flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-input-border">
        <span className="text-accent font-bold text-xl tracking-wider">
          WIN FORM
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-input-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-semibold">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-sm font-medium truncate">
              {user.name}
            </p>
            <p className="text-text-secondary text-xs truncate">
              {user.roleName}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Chiqish
        </button>
      </div>
    </aside>
  );
}
