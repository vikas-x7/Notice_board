"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authService } from "../services/auth.service";
import { registerSchema } from "../validations/auth.validation";
import { useAuthStore } from "../hooks/useAuth";
import { getUserHomeRoute } from "@/lib/user-home";

const inputClass =
  "w-full rounded-[5px] border border-line bg-surface px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-muted";
const selectClass =
  "w-full rounded-[5px] border border-line bg-surface px-3.5 py-2.5 text-sm text-white outline-none";

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rollNo: "",
    branch: "",
    year: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const data = await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        rollNo: form.rollNo,
        branch: form.branch,
        year: form.year,
      });
      setUser(data.user);
      toast.success("Registration successful!");
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
      <div className="relative z-10 w-full max-w-[500px] px-8 py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center text-white">
            <MdDashboard size={38} />
          </div>
          <h2 className="mb-1 text-2xl font-serif">
            Create your student account
          </h2>
          <p className="text-sm text-subtle">
            Register to access Smart Notice Board
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-danger/30 bg-danger/15 px-3.5 py-2.5 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="email"
            name="email"
            placeholder="you@college.edu"
            value={form.email}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="rollNo"
              placeholder="Roll no"
              value={form.rollNo}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              required
              className={selectClass}
            >
              <option value="">Select branch</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            className={selectClass}
          >
            <option value="">Select year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[5px] bg-[#B0AEAE] px-6 py-2 font-medium text-[#171615] transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-subtle">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary-light no-underline hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
