"use client"

import { motion } from "framer-motion"

export function Mascot() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="w-80 h-80 relative"
      >
        {/* Main Body */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full backdrop-blur-sm border border-primary/30">
          {/* Robot Face */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-32 h-32">
            {/* Eyes */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="flex justify-between items-center mb-4"
            >
              <div className="w-8 h-8 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
              <div className="w-8 h-8 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
            </motion.div>

            {/* Mouth */}
            <div className="w-16 h-8 bg-primary/80 rounded-full mx-auto relative overflow-hidden">
              <motion.div
                animate={{ x: [-20, 20, -20] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                className="absolute top-1 left-1 w-2 h-6 bg-primary-foreground rounded-full"
              />
            </div>
          </div>

          {/* Arms */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            className="absolute -left-8 top-1/3 w-16 h-4 bg-gradient-to-r from-primary/60 to-primary/40 rounded-full"
          />
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            className="absolute -right-8 top-1/3 w-16 h-4 bg-gradient-to-l from-primary/60 to-primary/40 rounded-full"
          />

          {/* Data Streams */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: [0, 1, 0], y: -100 }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                  ease: "linear",
                }}
                className="absolute w-1 h-8 bg-gradient-to-t from-primary/60 to-transparent rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 bg-primary/60 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl scale-110 -z-10" />
    </motion.div>
  )
}
