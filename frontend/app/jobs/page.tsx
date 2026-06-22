"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BriefcaseBusiness,
  MapPin,
  Search,
  Building2,
  Clock,
  ArrowRight,
  Heart,
} from "lucide-react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  job_type: string;
  description: string;
  requirements: string;
  created_at: string;
};

type User = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState("All");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingJobId, setLoadingJobId] = useState<number | null>(null);
  const [savingJobId, setSavingJobId] = useState<number | null>(null);

  useEffect(() => {
    fetchJobs();

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/jobs");
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

  const handleApply = async (jobId: number) => {
    setMessage("");
    setError("");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoadingJobId(jobId);

      const response = await fetch("http://localhost:5000/apply-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Application failed.");
        return;
      }

      setMessage("Application submitted successfully!");
    } catch {
      setError("Backend server not connected.");
    } finally {
      setLoadingJobId(null);
    }
  };

  const handleSaveJob = async (jobId: number) => {
    setMessage("");
    setError("");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      setSavingJobId(jobId);

      const response = await fetch("http://localhost:5000/save-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          jobId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save job.");
        return;
      }

      setMessage("Job saved successfully!");
    } catch {
      setError("Backend server not connected.");
    } finally {
      setSavingJobId(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      location === "All" ||
      job.location.toLowerCase() === location.toLowerCase();

    const matchesType =
      type === "All" || job.job_type.toLowerCase() === type.toLowerCase();

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen pt-12 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center px-5 py-2 rounded-full border border-purple-400/20 bg-white/5 text-purple-200 text-sm mb-6">
              Find opportunities designed for your future
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Explore <span className="gradient-text">Opportunities</span>
            </h1>

            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover real jobs posted by employers.
            </p>
          </div>

          {message && (
            <div className="max-w-5xl mx-auto mb-5 rounded-2xl border border-green-400/30 bg-green-500/10 px-5 py-4 text-green-300">
              {message}
            </div>
          )}

          {error && (
            <div className="max-w-5xl mx-auto mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          <div className="max-w-5xl mx-auto mb-16 grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <Search className="text-purple-300" size={20} />

              <input
                type="text"
                placeholder="Search jobs or companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-white placeholder:text-gray-400"
              />
            </div>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none"
            >
              <option className="bg-slate-900" value="All">
                All Locations
              </option>
              <option className="bg-slate-900" value="Remote">
                Remote
              </option>
              <option className="bg-slate-900" value="Colombo">
                Colombo
              </option>
              <option className="bg-slate-900" value="Hybrid">
                Hybrid
              </option>
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none"
            >
              <option className="bg-slate-900" value="All">
                All Types
              </option>
              <option className="bg-slate-900" value="Full Time">
                Full Time
              </option>
              <option className="bg-slate-900" value="Part Time">
                Part Time
              </option>
              <option className="bg-slate-900" value="Contract">
                Contract
              </option>
              <option className="bg-slate-900" value="Internship">
                Internship
              </option>
            </select>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center rounded-3xl border border-white/10 bg-white/5 p-10 text-gray-300">
              No jobs found.
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-purple-400/40 transition-all duration-300"
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
                      <Clock size={18} />
                      {job.job_type}
                    </div>
                  </div>

                  <p className="text-gray-400 mt-6 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="mt-10 flex flex-wrap justify-between items-center gap-4">
                    <div className="text-3xl font-bold gradient-text">
                      {job.salary}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        disabled={savingJobId === job.id}
                        className="px-5 py-4 rounded-2xl border border-pink-400/30 text-pink-300 hover:bg-pink-500/10 flex items-center gap-2 disabled:opacity-60"
                      >
                        <Heart size={18} />
                        {savingJobId === job.id ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={() => handleApply(job.id)}
                        disabled={loadingJobId === job.id}
                        className="glow-btn px-8 py-4 rounded-2xl flex items-center gap-2 disabled:opacity-60"
                      >
                        {loadingJobId === job.id ? "Applying..." : "Apply"}
                        <ArrowRight size={18} />
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