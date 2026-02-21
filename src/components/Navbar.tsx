import { NavLink } from "react-router-dom";
import { LayoutDashboard, MapPin, GraduationCap } from "lucide-react";
import type { User } from "../types/auth";

const API_BASE = "http://192.168.77.16:5050";

interface NavbarProps {
  user: User;
}

const navItems = [
  { to: "/", label: "Joylashuv", icon: MapPin },
  { to: "/locations", label: "Qurilmalar", icon: LayoutDashboard },
  { to: "/students", label: "Abiturientlar", icon: GraduationCap },
];

export default function Navbar({ user }: NavbarProps) {
  console.log(user);
  return (
    <header className="bg-card-bg border-b border-input-border px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-1.5">
        <span className="text-accent font-bold text-lg tracking-wider">
          WIN FORM
        </span>
      </div>

      {/* Nav tabs */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/5 text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User avatar */}
      <div className="flex items-center gap-3">
        {user.photoPath ? (
          <img
            src={`${API_BASE}/api/${user.photoPath}?token=${localStorage.getItem("token")}`}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-input-border"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-semibold border-2 border-input-border">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
      </div>
    </header>
  );
}
