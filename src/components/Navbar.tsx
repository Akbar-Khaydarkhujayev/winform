import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, MapPin, GraduationCap, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../api/auth";
import type { User } from "../types/auth";

export const API_BASE = "http://192.168.77.16:5050";

interface NavbarProps {
  user: User;
}

const navItems = [
  { to: "/", label: "Joylashuv", icon: MapPin },
  { to: "/locations", label: "Qurilmalar", icon: LayoutDashboard },
  { to: "/students", label: "Abiturientlar", icon: GraduationCap },
];

export default function Navbar({ user }: NavbarProps) {
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setShowMenu(false);
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showMenu]);

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    localStorage.removeItem("token");
    queryClient.clear();
    toast.success("Tizimdan chiqdingiz");
    window.location.href = "/login";
  }

  return (
    <header className="bg-card-bg border-b border-input-border px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-1.5 cursor-pointer select-none">
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

      {/* User avatar + logout */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="flex items-center gap-3 cursor-pointer"
        >
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
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-card-bg border border-input-border rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-input-border">
              <p className="text-text-primary text-sm font-medium truncate">
                {user.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut size={16} />
              Chiqish
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
