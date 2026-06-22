"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BriefcaseBusiness,
  Users,
  PlusCircle,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

type Stats = {
  totalJobs: number;
  totalApplicants: number;
};

export default function EmployerDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    totalApplicants: 0,
  });

  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (parsedUser.role !== "employer") {
      window.location.href = "/dashboard";
      return;
    }

    setUser(parsedUser);
    fetchStats(parsedUser.id);
  }, []);

  const fetchStats = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/employer-stats/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load statistics.");
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
            <p className="text-purple-300 mb-3">
              Welcome back, {user?.fullName}
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold">
              Employer <span className="gradient-text">Dashboard</span>
            </h1>

            <p className="text-gray-400 mt-4">
              Track your job posts, applications, and hiring activity.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <DashboardCard
              icon={<BriefcaseBusiness />}
              title="Total Jobs"
              value={stats.totalJobs}
              description="Jobs posted by your account"
            />

            <DashboardCard
              icon={<Users />}
              title="Total Applicants"
              value={stats.totalApplicants}
              description="Candidates applied to your jobs"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <ActionCard
              icon={<PlusCircle />}
              title="Post New Job"
              description="Create and publish a new job opportunity."
              href="/post-job"
            />

            <ActionCard
              icon={<BriefcaseBusiness />}
              title="Manage My Jobs"
              description="Edit, delete, and view applicants."
              href="/my-jobs"
            />

            <ActionCard
              icon={<LayoutDashboard />}
              title="Main Dashboard"
              description="Go back to your main dashboard."
              href="/dashboard"
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function DashboardCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-6 h-16 w-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
        {icon}
      </div>

      <h2 className="text-5xl font-extrabold gradient-text">{value}</h2>
      <p className="text-xl font-semibold mt-3">{title}</p>
      <p className="text-gray-400 mt-2">{description}</p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-purple-400/40 transition group"
    >
      <div className="mb-6 h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
        {icon}
      </div>

      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-gray-400 mt-3">{description}</p>

      <div className="mt-6 flex items-center gap-2 text-purple-300 group-hover:gap-4 transition-all">
        Open <ArrowRight size={18} />
      </div>
    </a>
  );
}