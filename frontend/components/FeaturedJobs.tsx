import { MapPin, BriefcaseBusiness, ArrowRight } from "lucide-react";

const jobs = [
  {
    title: "Senior Frontend Developer",
    company: "Google",
    location: "Remote",
    type: "Full Time",
    salary: "$5K - $8K",
  },
  {
    title: "Backend Engineer",
    company: "Microsoft",
    location: "Remote",
    type: "Full Time",
    salary: "$6K - $10K",
  },
  {
    title: "UI/UX Designer",
    company: "Spotify",
    location: "Hybrid",
    type: "Contract",
    salary: "$4K - $7K",
  },
  {
    title: "DevOps Engineer",
    company: "Amazon",
    location: "Remote",
    type: "Full Time",
    salary: "$7K - $12K",
  },
];

export default function FeaturedJobs() {
  return (
    <section className="py-24 px-8 bg-[#070a1a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Featured <span className="gradient-text">Jobs</span>
          </h2>
          <p className="text-gray-400 mt-4">
            Explore top opportunities from leading companies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <div
              key={job.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:-translate-y-2 hover:border-purple-400/40 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                <BriefcaseBusiness className="text-purple-300" />
              </div>

              <h3 className="text-xl font-bold mb-2">{job.title}</h3>
              <p className="text-purple-300 font-medium">{job.company}</p>

              <div className="flex items-center gap-2 text-gray-400 mt-5">
                <MapPin size={18} />
                {job.location}
              </div>

              <div className="flex justify-between items-center mt-6">
                <span className="text-sm rounded-full bg-white/10 px-4 py-2">
                  {job.type}
                </span>
                <span className="text-sm text-gray-300">{job.salary}</span>
              </div>

              <button className="mt-6 w-full rounded-2xl border border-white/10 py-3 flex items-center justify-center gap-2 hover:bg-purple-600 transition">
                View Job <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}