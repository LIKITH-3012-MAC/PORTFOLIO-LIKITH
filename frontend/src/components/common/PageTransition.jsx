import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../motion/variants';

export const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
