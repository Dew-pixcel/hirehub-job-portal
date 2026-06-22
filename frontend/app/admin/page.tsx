"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  BriefcaseBusiness,
  Building2,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

type AdminStats = {
  totalUsers: number;
  totalJobs: number;
  totalCompanies: number;
  totalApplications: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });

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

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin-stats");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load admin stats.");
        return;
      }

      setStats(data);
    } catch {
      setError("Backend server not connected.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen px-6 pt-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-400/20 bg-white/5 text-purple-200 text-sm mb-6">
              <ShieldCheck size={16} />
              Admin control center
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold">
              Admin <span className="gradient-text">Dashboard</span>
            </h1>

            <p className="text-gray-400 mt-4">
              Monitor users, jobs, companies, and applications.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Users />}
              title="Total Users"
              value={stats.totalUsers}
            />

            <StatCard
              icon={<BriefcaseBusiness />}
              title="Total Jobs"
              value={stats.totalJobs}
            />

            <StatCard
              icon={<Building2 />}
              title="Companies"
              value={stats.totalCompanies}
            />

            <StatCard
              icon={<FileCheck />}
              title="Applications"
              value={stats.totalApplications}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <AdminAction title="Manage Users" href="/admin/users" />
            <AdminAction title="Manage Jobs" href="/admin/jobs" />
            <AdminAction title="Manage Companies" href="/admin/companies" />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-6 h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
        {icon}
      </div>

      <h2 className="text-5xl font-extrabold gradient-text">{value}</h2>
      <p className="text-gray-400 mt-3">{title}</p>
    </div>
  );
}

function AdminAction({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-purple-400/40 transition"
    >
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-gray-400 mt-3">Open management section</p>
    </a>
  );
}