"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User,
  Mail,
  Phone,
  FileText,
  Sparkles,
  Image,
  Upload,
} from "lucide-react";

type UserData = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  phone: string;
  skills: string;
  bio: string;
  cv_file: string;
  profile_picture: string;
};

export default function ProfilePage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [profile, setProfile] = useState<UserData | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(savedUser);
    setUserId(user.id);
    fetchProfile(user.id);
  }, []);

  const fetchProfile = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/profile/${id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load profile.");
        return;
      }

      setProfile(data);
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
      setSkills(data.skills || "");
      setBio(data.bio || "");
    } catch {
      setError("Backend server not connected.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!userId) return;

    const formData = new FormData();

    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("skills", skills);
    formData.append("bio", bio);

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    if (cvFile) {
      formData.append("cvFile", cvFile);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/profile-upload/${userId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Profile update failed.");
        return;
      }

      setMessage("Profile updated successfully!");
      fetchProfile(userId);

      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        user.fullName = fullName;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch {
      setError("Backend server not connected.");
    }
  };

  const profileImageUrl = profile?.profile_picture
    ? `http://localhost:5000/${profile.profile_picture}`
    : "";

  const cvUrl = profile?.cv_file
    ? `http://localhost:5000/${profile.cv_file}`
    : "";

  return (
    <>
      <Navbar />

      <main className="hero-bg min-h-screen px-6 pt-12 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-400/20 bg-white/5 text-purple-200 text-sm mb-6">
              <Sparkles size={16} />
              Build your professional profile
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              My <span className="gradient-text">Profile</span>
            </h1>

            <p className="text-gray-300">
              Manage your personal information, skills, profile picture, and CV.
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

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="mx-auto h-28 w-28 rounded-full bg-purple-500/20 overflow-hidden flex items-center justify-center text-purple-300 mb-5">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={42} />
                )}
              </div>

              <h2 className="text-2xl font-bold">{fullName}</h2>
              <p className="text-purple-300 mt-2">{profile?.role}</p>
              <p className="text-gray-400 mt-3">{profile?.email}</p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-left">
                <p className="text-sm text-gray-400 mb-2">Skills</p>
                <p className="text-gray-200">
                  {skills || "No skills added yet."}
                </p>
              </div>

              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  className="mt-5 inline-flex items-center justify-center gap-2 w-full rounded-2xl border border-purple-400/30 bg-purple-500/10 px-4 py-3 text-purple-200 hover:bg-purple-500/20 transition"
                >
                  <FileText size={18} />
                  View CV
                </a>
              )}
            </div>

            <form
              onSubmit={handleUpdate}
              className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 space-y-5"
            >
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Full Name
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <User size={20} className="text-purple-300" />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-transparent w-full outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <Mail size={20} className="text-purple-300" />
                  <input
                    value={profile?.email || ""}
                    disabled
                    className="bg-transparent w-full outline-none text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Phone
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <Phone size={20} className="text-purple-300" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="bg-transparent w-full outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Upload Profile Picture
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <Image size={20} className="text-purple-300" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProfilePicture(e.target.files?.[0] || null)
                    }
                    className="w-full text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Upload CV PDF
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <Upload size={20} className="text-purple-300" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    className="w-full text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Skills
                </label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Next.js, Node.js, MySQL"
                  className="w-full min-h-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short professional summary..."
                  className="w-full min-h-32 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 outline-none"
                />
              </div>

              <button className="w-full glow-btn py-4 rounded-2xl font-semibold">
                Save Profile
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}