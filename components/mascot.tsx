"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Mascot() {
  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Wind Effect Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Speed Lines */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`speed-line-${i}`}
            initial={{ x: 100, opacity: 0 }}
            animate={{
              x: [-100, -200],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.1,
              ease: "easeOut",
            }}
            className="absolute w-16 h-0.5 bg-gradient-to-r from-primary/60 to-transparent rounded-full"
            style={{
              top: `${20 + i * 5}%`,
              right: `${10 + (i % 3) * 10}%`,
            }}
          />
        ))}

        {/* Wind Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`wind-particle-${i}`}
            initial={{ x: 50, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: [-50, -150],
              y: [0, Math.random() * 40 - 20],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.15,
              ease: "easeOut",
            }}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              top: `${30 + Math.random() * 40}%`,
              right: `${Math.random() * 30}%`,
            }}
          />
        ))}

        {/* Dust Clouds */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            initial={{ x: 0, opacity: 0, scale: 0 }}
            animate={{
              x: [-30, -80],
              opacity: [0, 0.3, 0],
              scale: [0, 1.5, 2],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.4,
              ease: "easeOut",
            }}
            className="absolute w-8 h-4 bg-gradient-radial from-muted/30 to-transparent rounded-full blur-sm"
            style={{
              bottom: `${10 + i * 3}%`,
              right: `${20 + (i % 2) * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Main Mascot Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10"
      >
        {/* Running Animation Container */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Glow Effect Behind Character */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-radial from-primary/20 via-primary/10 to-transparent rounded-full blur-xl scale-110"
          />

          {/* Main Character Image */}
          <motion.div
            animate={{
              x: [0, 2, -2, 0],
            }}
            transition={{
              duration: 0.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative w-80 h-80"
          >
            <Image
              height={8000}
              width={500}
              src="https://res.cloudinary.com/amanupadhyay1211/image/upload/e_background_removal/f_png/v1751635087/4ae860ae-19f0-4a52-9278-755252a685ed_o8fv7y.jpg"
              alt="WebScraper Pro Mascot - Super Hero"
              // fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Energy Aura */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            className="absolute inset-0 border-2 border-primary/20 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(var(--primary), 0.1), transparent)",
            }}
          />
        </motion.div>

        {/* Power-up Effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`power-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 1.5],
              x: [0, Math.cos((i * 45 * Math.PI) / 180) * 60],
              y: [0, Math.sin((i * 45 * Math.PI) / 180) * 60],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.25,
              ease: "easeOut",
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50"
          />
        ))}
      </motion.div>

      {/* Ground Effect */}
      <motion.div
        animate={{
          scaleX: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 0.6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 w-32 h-4 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-sm"
      />

      {/* Speed Burst Effect */}
      <motion.div
        animate={{
          scale: [0, 1.5, 0],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeOut",
        }}
        className="absolute inset-0 border-4 border-primary/30 rounded-full"
      />

      {/* Data Stream Effects */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`data-stream-${i}`}
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-100, -200],
            x: [0, Math.random() * 40 - 20],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
            ease: "linear",
          }}
          className="absolute w-1 h-8 bg-gradient-to-t from-primary/60 to-transparent rounded-full"
          style={{
            left: `${30 + i * 8}%`,
            bottom: "10%",
          }}
        />
      ))}
    </div>
  )
}
