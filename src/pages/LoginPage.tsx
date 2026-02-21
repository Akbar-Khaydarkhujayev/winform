import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { authApi } from "../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (token) => {
      localStorage.setItem("token", token.accessToken);
      toast.success("Muvaffaqiyatli kirdingiz!");
      navigate("/", { replace: true });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const data = err?.response?.data;
      const msg =
        (typeof data === "object" ? data?.message : data) ||
        "Login yoki parol noto'g'ri";
      toast.error(typeof msg === "string" ? msg : "Xatolik yuz berdi");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.warning("Login va parolni kiriting");
      return;
    }
    loginMutation.mutate({ username: username.trim(), password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <div className="bg-accent/10 border border-accent/30 rounded-xl px-6 py-3">
            <span className="text-accent font-bold text-2xl tracking-wider">
              WIN FORM
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card-bg rounded-2xl p-8 shadow-2xl shadow-black/30">
          <h2 className="text-text-primary text-2xl font-semibold text-center mb-2">
            Tizimga kirish
          </h2>
          <p className="text-text-secondary text-sm text-center mb-8">
            Login va parolingizni kiriting
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login Field */}
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                Login
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Loginni kiriting"
                  disabled={loginMutation.isPending}
                  className="w-full bg-input-bg border border-input-border rounded-xl py-3 pl-11 pr-4 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                Parol
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  disabled={loginMutation.isPending}
                  className="w-full bg-input-bg border border-input-border rounded-xl py-3 pl-11 pr-11 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-colors duration-200 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Kuting...
                </>
              ) : (
                "Kirish"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-text-secondary text-xs text-center mt-6">
          © 2026 Win Form. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
}
