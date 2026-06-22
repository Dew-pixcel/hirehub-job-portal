"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!fullName || !email || !password || !role) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setMessage("Account created successfully!");
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("jobseeker");
    } catch (err) {
      setError("Backend server not connected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen flex items-center justify-center px-6 pt-36 pb-20">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-3">
              Create <span className="gradient-text">Account</span>
            </h1>

            <p className="text-gray-400">
              Join HireHub and find your dream career.
            </p>
          </div>

          {message && (
            <div className="mb-5 rounded-2xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <User size={20} className="text-purple-300" />

                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent w-full outline-none text-white"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <Mail size={20} className="text-purple-300" />

                <input
                  type="email"
                  placeholder="john@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent w-full outline-none text-white"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Register As
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
              >
                <option className="bg-slate-900" value="jobseeker">
                  Job Seeker
                </option>
                <option className="bg-slate-900" value="employer">
                  Employer
                </option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Password
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <Lock size={20} className="text-purple-300" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent w-full outline-none text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glow-btn py-4 rounded-2xl font-semibold mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-gray-400 text-sm mt-5">
              Already have an account?{" "}
              <a href="/login" className="text-purple-400 hover:text-purple-300">
                Login
              </a>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}