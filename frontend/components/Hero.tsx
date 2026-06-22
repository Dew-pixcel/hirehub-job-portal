"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-110px)] overflow-hidden hero-bg flex items-center justify-center px-8">
      <div className="absolute inset-0 bg-black/10" />

      <div className="wave-line" />

      <motion.div
        initial={{ opacity: 0, y: 45 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 text-center max-w-6xl"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 text-sm text-purple-200 border border-purple-400/30 bg-white/5 backdrop-blur-xl shadow-lg shadow-purple-500/10">
          <Sparkles size={16} />
          <span>Smart hiring platform for modern careers</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl">
          Find Your{" "}
          <span className="gradient-text">
            Dream
          </span>{" "}
          Job
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed">
          Discover opportunities from top companies and connect with the career
          that matches your skills.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mt-4">
          <a
            href="/jobs"
            className="glow-btn px-12 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300"
          >
            Find Jobs
            <ArrowRight size={20} />
          </a>

          <a
            href="/post-job"
            className="px-10 py-4 rounded-2xl font-semibold border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-purple-400/40 transition-all duration-300"
          >
            Post a Job
          </a>
        </div>
      </motion.div>
    </section>
  );
}