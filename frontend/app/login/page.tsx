"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");

      setTimeout(() => {
       window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      setError("Backend server not connected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen flex items-center justify-center px-6 pt-12 pb-20">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-3">
              Welcome <span className="gradient-text">Back</span>
            </h1>

            <p className="text-gray-400">
              Login to continue your HireHub journey.
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

          <form onSubmit={handleLogin} className="space-y-5">
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
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-gray-400 text-sm mt-5">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-purple-400 hover:text-purple-300"
              >
                Register
              </a>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}