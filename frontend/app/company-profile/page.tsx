"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CompanyProfilePage() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [companyExists, setCompanyExists] = useState(false);

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
    loadCompany(parsedUser.id);
  }, []);

  const loadCompany = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/company-profile/${userId}`
      );

      if (!response.ok) return;

      const data = await response.json();

      setCompanyExists(true);

      setCompanyName(data.company_name || "");
      setIndustry(data.industry || "");
      setWebsite(data.website || "");
      setLocation(data.location || "");
      setDescription(data.description || "");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!user) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("employerId", user.id);
      formData.append("companyName", companyName);
      formData.append("industry", industry);
      formData.append("website", website);
      formData.append("location", location);
      formData.append("description", description);

      if (companyLogo) {
        formData.append("companyLogo", companyLogo);
      }

      const response = await fetch(
        companyExists
          ? `http://localhost:5000/company-profile/${user.id}`
          : "http://localhost:5000/company-profile",
        {
          method: companyExists ? "PUT" : "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed.");
        return;
      }

      setCompanyExists(true);

      setMessage(
        companyExists
          ? "Company profile updated successfully!"
          : "Company profile created successfully!"
      );
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
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold">
              Company <span className="gradient-text">Profile</span>
            </h1>

            <p className="text-gray-400 mt-4">
              Manage your company information.
            </p>
          </div>

          {message && (
            <div className="mb-5 rounded-2xl bg-green-500/10 border border-green-400/20 p-4 text-green-300">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl bg-red-500/10 border border-red-400/20 p-4 text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4"
              required
            />

            <input
              type="text"
              placeholder="Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4"
            />

            <input
              type="text"
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4"
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4"
            />

            <textarea
              placeholder="Company Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 min-h-40"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCompanyLogo(
                  e.target.files ? e.target.files[0] : null
                )
              }
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4"
            />

            <button
              disabled={loading}
              className="glow-btn w-full py-4 rounded-2xl font-semibold disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : companyExists
                ? "Update Company Profile"
                : "Create Company Profile"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}