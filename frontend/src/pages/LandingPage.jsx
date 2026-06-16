import { motion } from "framer-motion";
import { useLenis } from "../hooks/useLenis";

import HeroSection from "../components/LandingPage/HeroSection";
import CollectionSection from "../components/LandingPage/CollectionSection";
import EditorialSection from "../components/LandingPage/EditorialSection";
import Footer from "../components/LandingPage/Footer";

const LandingPage = () => {
  useLenis();

  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-black text-white relative">

      {/* ✅ LEFT GRADIENT */}
      <div className="fixed top-0 left-0 h-full w-[30vw] max-w-[420px] bg-gradient-to-r from-[#0a0f2c] via-[#0a0f2c] to-transparent pointer-events-none z-0" />

      {/* ✅ CONTENT */}
      <div className="relative z-10 w-full">

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <HeroSection />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <CollectionSection />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <EditorialSection />
        </motion.section>

        {/* ✅ FOOTER */}
        <motion.section
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Footer />
        </motion.section>

      

      </div>

    </main>
  );
};

export default LandingPage;
