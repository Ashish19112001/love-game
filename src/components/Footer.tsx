import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative z-10 overflow-hidden bg-[oklch(0.25_0.04_260)] text-white text-center py-8 mt-0 px-4 shadow-2xl"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-love-deep/40 via-primary/30 to-love-rose/40"
        animate={{ opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-3xl">
        <motion.div
          aria-hidden="true"
          className="mb-3 text-2xl"
          animate={{ scale: [1, 1.18, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          💖 ✨ 💖
        </motion.div>

        <p className="italic text-sm md:text-base font-medium tracking-wide drop-shadow-sm">
          Code and Designed By Ashish Gangwar🖤
        </p>

        <div className="mx-auto my-4 h-px w-40 bg-gradient-to-r from-transparent via-white/70 to-transparent" />

        <p className="text-xs opacity-80">
          ©2026 All Rights Reserved
        </p>
      </div>
    </motion.footer>
  );
}
