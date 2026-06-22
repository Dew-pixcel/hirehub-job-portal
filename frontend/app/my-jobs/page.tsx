"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  Trash2,
  Pencil,
} from "lucide-react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  job_type: string;
  applicant_count: number;
};

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.role !== "employer") {
      window.location.href = "/dashboard";
      return;
    }

    fetchMyJobs(user.id);
  }, []);

  const fetchMyJobs = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/my-jobs/${userId}`);
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
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

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
              <Sparkles size={16} />
              Employer job management
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              My <span className="gradient-text">Jobs</span>
            </h1>

            <p className="text-gray-300 text-lg">
              Manage your posted jobs, edit details, delete posts, and view
              applicants.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          {jobs.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
              You have not posted any jobs yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                      <BriefcaseBusiness />
                    </div>

                    <span className="px-4 py-2 rounded-full border border-purple-300/30 text-purple-100 text-sm">
                      {job.job_type}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold mb-5">{job.title}</h2>

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
                      <Users size={18} />
                      {job.applicant_count} Applicants
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap justify-between items-center gap-3">
                    <div className="text-3xl font-bold gradient-text">
                      {job.salary}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`/applicants/${job.id}`}
                        className="glow-btn px-6 py-3 rounded-2xl flex items-center gap-2"
                      >
                        View
                        <ArrowRight size={18} />
                      </a>

                      <a
                        href={`/edit-job/${job.id}`}
                        className="px-5 py-3 rounded-2xl border border-blue-400/30 text-blue-300 hover:bg-blue-500/10 flex items-center gap-2"
                      >
                        <Pencil size={18} />
                        Edit
                      </a>

                      <button
                        onClick={() => deleteJob(job.id)}
                        className="px-5 py-3 rounded-2xl border border-red-400/30 text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}