"use client";

import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const videos = ["/videos/clip-1.mp4", "/videos/clip-2.mp4"];

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.5,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

export default function Header({ data }: { data?: any }) {
  const title = data?.title || "BODHIQ";
  const tagline = data?.tagline || "Imperfect. Almost.";
  const description =
    data?.description ||
    "A minimalist luxury timepiece where ancient craft meets modern precision.\nHand-finished dial. Kintsugi-inspired detailing. Made for those who find beauty in the imperfect.";
  const ctaText = data?.ctaText || "Explore";
  const ctaLink = data?.ctaLink || "/collection";

  const backgroundType = data?.backgroundType || "video";

  // Your query already returns asset.url, so use direct URL
  const imageUrl = data?.backgroundImage?.asset?.url || "";
  const sanityVideoUrl =
    data?.backgroundVideoFile?.asset?.url || data?.backgroundVideoUrl || "";

  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (backgroundType !== "video" || sanityVideoUrl) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    };

    videoElement.addEventListener("ended", handleEnded);

    return () => {
      videoElement.removeEventListener("ended", handleEnded);
    };
  }, [backgroundType, sanityVideoUrl]);

  useEffect(() => {
    if (videoRef.current && !sanityVideoUrl) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideo, sanityVideoUrl]);

  useEffect(() => {
    if (videoRef.current && sanityVideoUrl) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.log("Sanity video play failed:", err);
      });
    }
  }, [sanityVideoUrl]);

  const activeVideoSrc = sanityVideoUrl || videos[currentVideo];

  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      >
        {backgroundType === "image" && imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : backgroundType === "video" && activeVideoSrc ? (
          <video
            key={activeVideoSrc}
            ref={videoRef}
            src={activeVideoSrc}
            autoPlay
            muted
            loop={!!sanityVideoUrl}
            playsInline
            preload="auto"
            aria-label={`${title} cinematic reveal`}
            className="w-full h-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <motion.div variants={fadeUp} className="mb-8">
          <span className="inline-block px-5 py-1.5 rounded-full border border-[#d4a853]/30 bg-[#d4a853]/10 text-[10px] uppercase tracking-[0.3em] text-[#d4a853] backdrop-blur-sm">
            Launch Edition — Limited First Drop
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-8xl font-serif leading-[1.05] tracking-tight"
        >
          <span className="block text-white">{title}</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl md:text-3xl font-serif text-[#d4a853]/90 mt-4 italic"
        >
          {tagline}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-gray-300 mt-6 text-sm md:text-base max-w-xl mx-auto leading-relaxed whitespace-pre-line drop-shadow-md"
        >
          {description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={ctaLink}>
            <button className="px-10 py-3.5 bg-[#d4a853] text-black uppercase tracking-widest text-xs font-medium hover:bg-[#e8c97a] hover:scale-105 transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]">
              {ctaText}
            </button>
          </Link>
          <Link href="/collection">
            <button className="px-10 py-3.5 border border-white/15 text-gray-300 uppercase tracking-widest text-xs hover:border-[#d4a853]/40 hover:text-white hover:scale-105 transition-all duration-300 rounded-full bg-black/20 backdrop-blur-sm">
              ₹4,200
            </button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#d4a853]/60 to-transparent mx-auto" />
        <p className="text-[9px] uppercase tracking-[0.35em] text-gray-400 mt-3">
          Scroll
        </p>
      </motion.div>
    </section>
  );
}