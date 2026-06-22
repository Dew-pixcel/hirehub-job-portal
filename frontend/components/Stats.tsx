const stats = [
  { number: "12K+", label: "Active Jobs" },
  { number: "5K+", label: "Companies" },
  { number: "50K+", label: "Candidates" },
  { number: "98%", label: "Success Rate" },
];

export default function Stats() {
  return (
    <section className="py-20 px-8 bg-[#070a1a]">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center hover:scale-105 hover:border-purple-400/40 transition-all duration-300"
          >
            <h3 className="text-4xl font-extrabold gradient-text">
              {stat.number}
            </h3>
            <p className="text-gray-400 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}