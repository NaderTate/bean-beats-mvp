"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface TooltipProps {
  label: string;
  direction?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  label,
  direction = "top",
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations();

  const getPositionClasses = () => {
    switch (direction) {
      case "top":
        return "bottom-full mb-2 left-1/2 transform -translate-x-1/2";
      case "bottom":
        return "top-full mt-2 left-1/2 transform -translate-x-1/2";
      case "left":
        return "right-full mr-2 top-1/2 transform -translate-y-1/2 -translate-x-full";
      case "right":
        return "left-full ml-2 top-1/2 transform -translate-y-1/2";
      default:
        return "";
    }
  };

  const getMotionDirection = () => {
    switch (direction) {
      case "top":
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 10 },
        };
      case "bottom":
        return {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
        };
      case "left":
        return {
          initial: { opacity: 0, x: 10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 10 },
        };
      case "right":
        return {
          initial: { opacity: 0, x: -10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -10 },
        };
      default:
        return {};
    }
  };

  return (
    <div
      className="relative inline-block overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <motion.div
          {...getMotionDirection()}
          className={`absolute z-50 px-4 py-2 rounded-lg bg-gray-700 text-white text-sm shadow-lg whitespace-nowrap max-w-max ${getPositionClasses()}`}
        >
          {t(label)}
        </motion.div>
      )}
    </div>
  );
};

export default Tooltip;
