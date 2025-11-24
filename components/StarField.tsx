
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const StarField: React.FC = () => {
  // Generate random stars once
  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      // Logic to concentrate stars in the top-left (purple area)
      // 70% chance to be in the "Purple Zone", 30% global
      const isCluster = Math.random() < 0.7;
      
      let left, top;

      if (isCluster) {
        // Cluster in top-left (0-50% X, 0-50% Y) with slight spread
        // Using power to bias towards the center of the cluster (0,0)
        left = Math.random() * 55; 
        top = Math.random() * 50; 
      } else {
        // Global scattered stars
        left = Math.random() * 100;
        top = Math.random() * 100;
      }

      return {
        id: i,
        left,
        top,
        size: Math.random() * 1.5 + 1, // 1px - 2.5px
        duration: Math.random() * 3 + 2, // 2s - 5s cycle
        delay: Math.random() * 3, // Random start delay
        opacityMin: Math.random() * 0.15 + 0.1, // 0.1-0.25
        opacityMax: Math.random() * 0.35 + 0.35, // 0.35-0.7
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size + 2}px rgba(255, 255, 255, 0.7)`
          }}
          initial={{ opacity: star.opacityMin, scale: 1 }}
          animate={{
            opacity: [star.opacityMin, star.opacityMax, star.opacityMin],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};
