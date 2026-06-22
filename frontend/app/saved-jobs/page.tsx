"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Clock,
  Trash2,
  ArrowRight,
  Heart,
} from "lucide-react";

type SavedJob = {
  saved_id: number;
  saved_at: string;
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  job_type: string;
  description: string;
};

type User = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingJobId, setLoadingJobId] = useState<number | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    fetchSavedJobs(parsedUser.id);
  }, []);

  const fetchSavedJobs = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/saved-jobs/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load saved jobs.");
        return;
      }

      setSavedJobs(data);
    } catch {
      setError("Backend server not connected.");
    }
  };

  const removeSavedJob = async (savedId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/saved-job/${savedId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Remove failed.");
        return;
      }

      setMessage("Saved job removed successfully!");
      setSavedJobs((prev) => prev.filter((job) => job.saved_id !== savedId));
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

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen px-6 pt-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-pink-400/20 bg-white/5 text-pink-200 text-sm mb-6">
              <Heart size={16} />
              Your saved opportunities
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Saved <span className="gradient-text">Jobs</span>
            </h1>

            <p className="text-gray-300 text-lg">
              Review your favorite opportunities and apply anytime.
            </p>
          </div>

          {message && (
            <div className="mb-6 rounded-2xl border border-green-400/30 bg-green-500/10 px-5 py-4 text-green-300">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          {savedJobs.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
              You have not saved any jobs yet.
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {savedJobs.map((job) => (
                <div
                  key={job.saved_id}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-pink-400/40 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-300">
                      <BriefcaseBusiness />
                    </div>

                    <span className="px-4 py-2 rounded-full border border-pink-300/30 text-pink-100 text-sm">
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
                      Saved on {new Date(job.saved_at).toLocaleDateString()}
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
                        onClick={() => removeSavedJob(job.saved_id)}
                        className="px-5 py-4 rounded-2xl border border-red-400/30 text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        Remove
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