"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BriefcaseBusiness,
  Bookmark,
  UserCheck,
  Building2,
  Users,
  CalendarCheck,
} from "lucide-react";

type User = {
  id: number;
  fullName: string;
  email: string;
  role: "jobseeker" | "employer" | "admin";
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(JSON.parse(savedUser));
  }, []);

  if (!user) {
    return (
      <main className="hero-bg min-h-screen flex items-center justify-center text-white">
        Loading...
      </main>
    );
  }

  const isEmployer = user.role === "employer";

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen px-6 pt-14 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-purple-300 mb-3">
              Welcome back, {user.fullName}
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold">
              {isEmployer ? "Employer" : "Job Seeker"}{" "}
              <span className="gradient-text">Dashboard</span>
            </h1>

            <p className="text-gray-400 mt-4">
              Manage your career activity and track your progress.
            </p>
          </div>

          {isEmployer ? <EmployerDashboard /> : <JobSeekerDashboard />}

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="mt-10 rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-3 text-red-300 hover:bg-red-500/20 transition"
          >
            Logout
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}

function JobSeekerDashboard() {
  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<BriefcaseBusiness />}
          number="12"
          label="Applications"
        />

        <StatCard
          icon={<Bookmark />}
          number="8"
          label="Saved Jobs"
        />

        <StatCard
          icon={<UserCheck />}
          number="90%"
          label="Profile Complete"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="/my-applications"
          className="glow-btn px-6 py-3 rounded-2xl font-semibold"
        >
          My Applications
        </a>

        <a
          href="/jobs"
          className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-purple-400/40 transition"
        >
          Browse Jobs
        </a>
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-bold mb-6">
          Recent Applications
        </h2>

        <div className="space-y-4">
          <Activity
            title="Software Engineering Intern"
            status="Pending"
          />

          <Activity
            title="Frontend Developer"
            status="Reviewed"
          />

          <Activity
            title="QA Engineer"
            status="Accepted"
          />
        </div>
      </div>
    </>
  );
}

function EmployerDashboard() {
  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<Building2 />}
          number="5"
          label="Active Jobs"
        />

        <StatCard
          icon={<Users />}
          number="120"
          label="Applications"
        />

        <StatCard
          icon={<CalendarCheck />}
          number="15"
          label="Interviews"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="/post-job"
          className="glow-btn px-6 py-3 rounded-2xl font-semibold"
        >
          Post New Job
        </a>

        <a
          href="/jobs"
          className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-purple-400/40 transition"
        >
          View Jobs
        </a>
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-bold mb-6">
          Recent Applicants
        </h2>

        <div className="space-y-4">
          <Activity
            title="John Doe"
            status="Frontend Developer"
          />

          <Activity
            title="Sarah Smith"
            status="UI/UX Designer"
          />

          <Activity
            title="Alex Brown"
            status="Backend Engineer"
          />
        </div>
      </div>
    </>
  );
}

function StatCard({
  icon,
  number,
  label,
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-purple-400/40 transition">
      <div className="mb-5 h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
        {icon}
      </div>

      <h3 className="text-4xl font-extrabold gradient-text">{number}</h3>
      <p className="text-gray-400 mt-2">{label}</p>
    </div>
  );
}

function Activity({ title, status }: { title: string; status: string }) {
  return (
    <div className="flex justify-between items-center rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
      <p className="font-medium">{title}</p>
      <span className="text-sm text-purple-300">{status}</span>
    </div>
  );
}