"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Mail, ShieldCheck, Calendar } from "lucide-react";

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/users");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load users.");
        return;
      }

      setUsers(data);
    } catch {
      setError("Backend server not connected.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen px-6 pt-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-400/20 bg-white/5 text-purple-200 text-sm mb-6">
              <Users size={16} />
              Admin user management
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Manage <span className="gradient-text">Users</span>
            </h1>

            <p className="text-gray-300 text-lg">
              View all registered job seekers, employers, and admins.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
              >
                <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300 mb-5">
                  <Users />
                </div>

                <h2 className="text-2xl font-bold mb-4">
                  {user.full_name}
                </h2>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-3">
                    <Mail size={18} />
                    {user.email}
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} />
                    {user.role}
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={18} />
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}