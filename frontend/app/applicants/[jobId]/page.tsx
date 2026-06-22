"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Mail, Phone, FileText, Sparkles } from "lucide-react";

type Applicant = {
  application_id: number;
  status: string;
  applied_at: string;
  full_name: string;
  email: string;
  phone: string;
  skills: string;
  bio: string;
  cv_file: string;
  profile_picture: string;
};

export default function ApplicantsPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/job-applicants/${jobId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load applicants.");
        return;
      }

      setApplicants(data);
    } catch {
      setError("Backend server not connected.");
    }
  };

  const updateStatus = async (applicationId: number, status: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/application-status/${applicationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Status update failed.");
      return;
    }

    fetchApplicants();
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
              Employer applicant management
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Job <span className="gradient-text">Applicants</span>
            </h1>

            <p className="text-gray-300 text-lg">
              Review candidates and download their CVs.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          {applicants.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
              No applicants for this job yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {applicants.map((applicant) => {
                const imageUrl = applicant.profile_picture
                  ? `http://localhost:5000/${applicant.profile_picture}`
                  : "";

                const cvUrl = applicant.cv_file
                  ? `http://localhost:5000/${applicant.cv_file}`
                  : "";

                return (
                  <div
                    key={applicant.application_id}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
                  >
                    <div className="flex items-start gap-5 mb-6">
                      <div className="h-20 w-20 rounded-full bg-purple-500/20 overflow-hidden flex items-center justify-center text-purple-300">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={applicant.full_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={34} />
                        )}
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold">
                          {applicant.full_name}
                        </h2>

                        <select
                            value={applicant.status}
                            onChange={(e) =>
                                updateStatus(applicant.application_id, e.target.value)
                            }
                            className="mt-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-purple-200 outline-none"
                        >
                            <option className="bg-slate-900" value="Pending">Pending</option>
                            <option className="bg-slate-900" value="Reviewed">Reviewed</option>
                            <option className="bg-slate-900" value="Shortlisted">Shortlisted</option>
                            <option className="bg-slate-900" value="Rejected">Rejected</option>
                        </select>

                        <p className="text-gray-400 text-sm mt-1">
                          Applied on{" "}
                          {new Date(applicant.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-center gap-3">
                        <Mail size={18} />
                        {applicant.email}
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone size={18} />
                        {applicant.phone || "No phone added"}
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-gray-400 mb-2">Skills</p>
                      <p>{applicant.skills || "No skills added"}</p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-gray-400 mb-2">Bio</p>
                      <p>{applicant.bio || "No bio added"}</p>
                    </div>

                    {cvUrl && (
                      <a
                        href={cvUrl}
                        target="_blank"
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl glow-btn px-5 py-4 font-semibold"
                      >
                        <FileText size={18} />
                        View / Download CV
                      </a>
                    )}
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