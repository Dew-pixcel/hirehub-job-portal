export default function Companies() {
  const companies = ["Google", "Microsoft", "Amazon", "Spotify", "Netflix"];

  return (
    <section className="py-16 px-8 bg-[#070a1a]">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-400 mb-8">Trusted by 500+ leading companies</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {companies.map((company) => (
            <div
              key={company}
              className="rounded-2xl border border-white/10 bg-white/5 py-5 text-gray-300 font-semibold hover:border-purple-400/40 hover:text-white transition"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}