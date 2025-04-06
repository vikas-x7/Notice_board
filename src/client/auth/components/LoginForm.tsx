"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authService } from "../services/auth.service";
import { loginSchema } from "../validations/auth.validation";
import { useAuthStore } from "../hooks/useAuth";
import { getUserHomeRoute } from "@/lib/user-home";

const inputClass =
  "w-full rounded-[5px] border border-line bg-surface px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-muted";

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.replace(getUserHomeRoute(data.user.role));
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#171615]">
      <div className="relative z-10 w-full max-w-[440px] px-8 py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center text-white">
            <MdDashboard size={38} />
          </div>
          <h2 className="mb-1 text-2xl font-serif">
            Sign in to never miss a notice
          </h2>
          <p className="text-sm text-subtle">Sign in to Smart Notice Board</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-danger/30 bg-danger/15 px-3.5 py-2.5 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors flex items-center justify-center p-1 !cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[5px] bg-[#B0AEAE] px-6 py-2 font-medium text-[#171615] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-subtle">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary-light no-underline hover:underline"
          >
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
}
