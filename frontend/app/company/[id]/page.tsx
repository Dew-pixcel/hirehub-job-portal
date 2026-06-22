"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Globe, MapPin, ArrowLeft } from "lucide-react";

type Company = {
  id: number;
  company_name: string;
  industry: string;
  website: string;
  location: string;
  description: string;
  logo: string;
};

export default function CompanyDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`http://localhost:5000/companies/${id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load company.");
        return;
      }

      setCompany(data);
    } catch {
      setError("Backend server not connected.");
    }
  };

  const logoUrl = company?.logo
    ? `http://localhost:5000/${company.logo}`
    : "";

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen px-6 pt-12 pb-24">
        <div className="max-w-5xl mx-auto">
          <a
            href="/companies"
            className="inline-flex items-center gap-2 text-purple-300 mb-8"
          >
            <ArrowLeft size={18} />
            Back to Companies
          </a>

          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          {company && (
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="h-28 w-28 rounded-3xl bg-purple-500/20 overflow-hidden flex items-center justify-center text-purple-300">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={company.company_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 size={48} />
                  )}
                </div>

                <div>
                  <h1 className="text-4xl md:text-6xl font-extrabold">
                    {company.company_name}
                  </h1>

                  <p className="text-purple-300 text-xl mt-3">
                    {company.industry || "Industry not specified"}
                  </p>

                  <div className="flex flex-wrap gap-5 mt-6 text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      {company.location || "No location"}
                    </div>

                    <div className="flex items-center gap-2">
                      <Globe size={18} />
                      {company.website || "No website"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-8">
                <h2 className="text-2xl font-bold mb-4">
                  About Company
                </h2>

                <p className="text-gray-300 leading-relaxed">
                  {company.description || "No description added."}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}