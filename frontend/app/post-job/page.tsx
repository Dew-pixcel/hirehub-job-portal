"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BriefcaseBusiness } from "lucide-react";

export default function PostJobPage() {
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(JSON.parse(savedUser));
  }, []);

  const handlePostJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title || !company || !location || !salary || !description || !requirements) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          company,
          location,
          salary,
          jobType,
          description,
          requirements,
          createdBy: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Job posting failed.");
        return;
      }

      setMessage("Job posted successfully!");
      setTitle("");
      setCompany("");
      setLocation("");
      setSalary("");
      setJobType("Full Time");
      setDescription("");
      setRequirements("");
    } catch {
      setError("Backend server not connected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen px-6 pt-12 pb-24">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
              <BriefcaseBusiness />
            </div>

            <h1 className="text-4xl font-extrabold">
              Post a <span className="gradient-text">Job</span>
            </h1>

            <p className="text-gray-400 mt-3">
              Publish a new opportunity for talented candidates.
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

          <form onSubmit={handlePostJob} className="space-y-5">
            <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />

            <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />

            <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

            <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />

            <select className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none" value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option className="bg-slate-900">Full Time</option>
              <option className="bg-slate-900">Part Time</option>
              <option className="bg-slate-900">Internship</option>
              <option className="bg-slate-900">Contract</option>
            </select>

            <textarea className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none min-h-32" placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <textarea className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none min-h-32" placeholder="Requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} />

            <button disabled={loading} className="w-full glow-btn py-4 rounded-2xl font-semibold disabled:opacity-60">
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}