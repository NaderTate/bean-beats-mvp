'use client';
import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoad = () => {
  return (
    <div className="flex flex-col gap-3 w-full animate-pulse p-2 md:p-8">
      <motion.div
        animate={{
          width: ['100%', '30%', '100%', '80%', '100%'],
          transition: {
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
          },
        }}
        className="w-1/2 h-4 bg-gray-300 rounded-full"
      />
      <motion.div
        animate={{
          width: ['100%', '30%', '100%', '80%', '100%'],
          transition: {
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
          },
        }}
        className="w-3/4 h-4 bg-gray-300 rounded-full"
      />
      <motion.div
        animate={{
          width: ['100%', '30%', '100%', '80%', '100%'],
          transition: {
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          },
        }}
        className="w-2/3 h-4 bg-gray-300 rounded-full"
      />
    </div>
  );
};

export default SkeletonLoad;
