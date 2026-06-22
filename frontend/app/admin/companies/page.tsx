"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Building2,
  Globe,
  MapPin,
  User,
  Trash2,
} from "lucide-react";

type Company = {
  id: number;
  employer_id: number;
  company_name: string;
  industry: string;
  website: string;
  location: string;
  description: string;
  logo: string;
  employer_name: string;
  created_at: string;
};

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
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

    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/companies");
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load companies.");
        return;
      }

      setCompanies(data);
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
              <Building2 size={16} />
              Admin company management
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Manage <span className="gradient-text">Companies</span>
            </h1>

            <p className="text-gray-300 text-lg">
              View all employer company profiles.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          {companies.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
              No companies found.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {companies.map((company) => {
                const logoUrl = company.logo
                  ? `http://localhost:5000/${company.logo}`
                  : "";

                return (
                  <div
                    key={company.id}
                    className="rounded-3xl border border-white/10 bg-white/5 p-8"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="h-16 w-16 rounded-2xl bg-purple-500/20 overflow-hidden flex items-center justify-center text-purple-300">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={company.company_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 />
                        )}
                      </div>

                      <span className="px-4 py-2 rounded-full border border-purple-300/30 text-purple-100 text-sm">
                        {company.industry || "Company"}
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold mb-5">
                      {company.company_name}
                    </h2>

                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-center gap-3">
                        <User size={18} />
                        Employer: {company.employer_name || "Unknown"}
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin size={18} />
                        {company.location || "No location"}
                      </div>

                      <div className="flex items-center gap-3">
                        <Globe size={18} />
                        {company.website || "No website"}
                      </div>
                    </div>

                    <p className="text-gray-400 mt-6 line-clamp-3">
                      {company.description || "No description added."}
                    </p>

                    <div className="mt-8 flex justify-between items-center gap-4">
                      <a
                        href={`/company/${company.id}`}
                        className="glow-btn px-6 py-3 rounded-2xl"
                      >
                        View
                      </a>

                      <button
                        disabled
                        className="px-5 py-3 rounded-2xl border border-red-400/20 text-red-300/50 flex items-center gap-2 cursor-not-allowed"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}