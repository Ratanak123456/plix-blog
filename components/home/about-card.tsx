"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative flex-1"
    >
      <div className="relative z-10 aspect-video overflow-hidden bg-card text-center comic-border shadow-2xl">
        <Image
          src="/talk.jpg"
          alt="Our team discussing"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {/* Decorative background shape */}
      <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 bg-secondary opacity-20 comic-border" />
    </motion.div>
  );
}
