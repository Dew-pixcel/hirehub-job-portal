"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="relative mx-auto mt-4 w-[92%] z-50 bg-[#10162b]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold">
          Hire<span className="gradient-text">Hub</span>
        </h1>

        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-200">
          <a href="/" className="hover:text-purple-400 transition">Home</a>
          <a href="/jobs" className="hover:text-purple-400 transition">Jobs</a>
          <a href="/companies" className="hover:text-purple-400 transition">Companies</a>

          {!user && (
            <>
              <a href="/login" className="hover:text-purple-400 transition">Login</a>
              <a href="/register" className="hover:text-purple-400 transition">Register</a>
            </>
          )}

          {user?.role === "jobseeker" && (
            <>
              <a href="/saved-jobs" className="hover:text-purple-400 transition">Saved Jobs</a>
              <a href="/my-applications" className="hover:text-purple-400 transition">Applications</a>
              <a href="/profile" className="hover:text-purple-400 transition">Profile</a>
              <button onClick={logout} className="hover:text-red-400 transition">
                Logout
              </button>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <a href="/employer-dashboard" className="hover:text-purple-400 transition">Dashboard</a>
              <a href="/post-job" className="hover:text-purple-400 transition">Post Job</a>
              <a href="/my-jobs" className="hover:text-purple-400 transition">My Jobs</a>
              <a href="/company-profile" className="hover:text-purple-400 transition">Company Profile</a>
              <a href="/profile" className="hover:text-purple-400 transition">Profile</a>
              <button onClick={logout} className="hover:text-red-400 transition">
                Logout
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <a href="/admin" className="hover:text-purple-400 transition">Admin Dashboard</a>
              <a href="/admin/users" className="hover:text-purple-400 transition">Users</a>
              <a href="/admin/jobs" className="hover:text-purple-400 transition">Admin Jobs</a>
              <a href="/admin/companies" className="hover:text-purple-400 transition">Admin Companies</a>
              <button onClick={logout} className="hover:text-red-400 transition">
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-gray-200">
          <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/jobs" onClick={() => setMenuOpen(false)}>Jobs</a>
          <a href="/companies" onClick={() => setMenuOpen(false)}>Companies</a>

          {!user && (
            <>
              <a href="/login" onClick={() => setMenuOpen(false)}>Login</a>
              <a href="/register" onClick={() => setMenuOpen(false)}>Register</a>
            </>
          )}

          {user?.role === "jobseeker" && (
            <>
              <a href="/saved-jobs" onClick={() => setMenuOpen(false)}>Saved Jobs</a>
              <a href="/my-applications" onClick={() => setMenuOpen(false)}>Applications</a>
              <a href="/profile" onClick={() => setMenuOpen(false)}>Profile</a>
              <button onClick={logout} className="text-left text-red-400">
                Logout
              </button>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <a href="/employer-dashboard" onClick={() => setMenuOpen(false)}>Dashboard</a>
              <a href="/post-job" onClick={() => setMenuOpen(false)}>Post Job</a>
              <a href="/my-jobs" onClick={() => setMenuOpen(false)}>My Jobs</a>
              <a href="/company-profile" onClick={() => setMenuOpen(false)}>Company Profile</a>
              <a href="/profile" onClick={() => setMenuOpen(false)}>Profile</a>
              <button onClick={logout} className="text-left text-red-400">
                Logout
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <a href="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</a>
              <a href="/admin/users" onClick={() => setMenuOpen(false)}>Users</a>
              <a href="/admin/jobs" onClick={() => setMenuOpen(false)}>Admin Jobs</a>
              <a href="/admin/companies" onClick={() => setMenuOpen(false)}>Admin Companies</a>
              <button onClick={logout} className="text-left text-red-400">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}