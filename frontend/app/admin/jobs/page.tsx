"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Trash2,
  User,
} from "lucide-react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  job_type: string;
  employer_name: string;
  created_at: string;
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
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

    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/jobs");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load jobs.");
        return;
      }

      setJobs(data);
    } catch {
      setError("Backend server not connected.");
    }
  };

  const deleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(`http://localhost:5000/jobs/${jobId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Delete failed.");
        return;
      }

      setJobs((prev) => prev.filter((job) => job.id !== jobId));
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
              <BriefcaseBusiness size={16} />
              Admin job management
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Manage <span className="gradient-text">Jobs</span>
            </h1>

            <p className="text-gray-300 text-lg">
              View and remove platform job listings.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                    <BriefcaseBusiness />
                  </div>

                  <span className="px-4 py-2 rounded-full border border-purple-300/30 text-purple-100 text-sm">
                    {job.job_type}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-5">{job.title}</h2>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-3">
                    <Building2 size={18} />
                    {job.company}
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={18} />
                    {job.location}
                  </div>

                  <div className="flex items-center gap-3">
                    <User size={18} />
                    Posted by: {job.employer_name || "Unknown"}
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center gap-4">
                  <div className="text-2xl font-bold gradient-text">
                    {job.salary}
                  </div>

                  <button
                    onClick={() => deleteJob(job.id)}
                    className="px-5 py-3 rounded-2xl border border-red-400/30 text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
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