"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BriefcaseBusiness, Building2, MapPin, Clock } from "lucide-react";

type Application = {
  id: number;
  status: string;
  applied_at: string;
  title: string;
  company: string;
  location: string;
};

type User = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    fetchApplications(parsedUser.id);
  }, []);

  const fetchApplications = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/my-applications/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load applications.");
        return;
      }

      setApplications(data);
    } catch {
      setError("Backend server not connected.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen px-6 pt-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-400/20 bg-white/5 text-purple-200 text-sm mb-6">
              <BriefcaseBusiness size={16} />
              Track your job applications
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              My <span className="gradient-text">Applications</span>
            </h1>

            <p className="text-gray-300 text-lg">
              Welcome, {user?.fullName}. View your application status here.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-red-300">
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
              You have not applied for any jobs yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                      <BriefcaseBusiness />
                    </div>

                    <span className="px-4 py-2 rounded-full border border-purple-300/30 text-purple-100 text-sm">
                      {app.status}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-5">{app.title}</h2>

                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center gap-3">
                      <Building2 size={18} />
                      {app.company}
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin size={18} />
                      {app.location}
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock size={18} />
                      Applied on{" "}
                      {new Date(app.applied_at).toLocaleDateString()}
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