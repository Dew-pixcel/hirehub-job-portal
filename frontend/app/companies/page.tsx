"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Globe, MapPin, ArrowRight } from "lucide-react";

type Company = {
  id: number;
  employer_id: number;
  company_name: string;
  industry: string;
  website: string;
  location: string;
  description: string;
  logo: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:5000/companies");
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
              Discover trusted employers
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Explore <span className="gradient-text">Companies</span>
            </h1>

            <p className="text-gray-300 text-lg">
              Browse company profiles and find your next workplace.
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company) => {
                const logoUrl = company.logo
                  ? `http://localhost:5000/${company.logo}`
                  : "";

                return (
                  <div
                    key={company.id}
                    className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-purple-400/40 transition"
                  >
                    <div className="h-20 w-20 rounded-3xl bg-purple-500/20 overflow-hidden flex items-center justify-center text-purple-300 mb-6">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={company.company_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 size={36} />
                      )}
                    </div>

                    <h2 className="text-2xl font-bold mb-2">
                      {company.company_name}
                    </h2>

                    <p className="text-purple-300 mb-5">
                      {company.industry || "Technology"}
                    </p>

                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-center gap-3">
                        <MapPin size={18} />
                        {company.location || "Not specified"}
                      </div>

                      <div className="flex items-center gap-3">
                        <Globe size={18} />
                        {company.website || "No website"}
                      </div>
                    </div>

                    <p className="text-gray-400 mt-5 line-clamp-3">
                      {company.description || "No company description added."}
                    </p>

                    <a
                      href={`/company/${company.id}`}
                      className="mt-6 inline-flex items-center gap-2 text-purple-300 hover:gap-4 transition-all"
                    >
                      View Company <ArrowRight size={18} />
                    </a>
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