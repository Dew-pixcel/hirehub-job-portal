import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Companies from "@/components/Companies";
import Stats from "@/components/Stats";
import FeaturedJobs from "@/components/FeaturedJobs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Companies />
      <Stats />
      <FeaturedJobs />
      <Footer />
    </>
  );
}