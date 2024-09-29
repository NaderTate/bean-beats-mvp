"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useState, useRef, useEffect } from "react";

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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      switch (direction) {
        case "top":
          top = rect.top - 10;
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left - 10;
          break;
        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + 10;
          break;
      }

      setPosition({ top, left });
    }
  }, [isHovered, direction]);

  const getMotionDirection = () => {
    switch (direction) {
      case "top":
        return { y: 10 };
      case "bottom":
        return { y: -10 };
      case "left":
        return { x: 10 };
      case "right":
        return { x: -10 };
      default:
        return {};
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, ...getMotionDirection() }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...getMotionDirection() }}
            transition={{ duration: 0.2 }}
            className="fixed px-4 py-2 rounded-lg bg-gray-700 text-white text-sm shadow-lg whitespace-nowrap max-w-max"
            style={{
              top: position.top,
              left: position.left,
              transform: `translate(${
                direction === "left"
                  ? "-100%"
                  : direction === "right"
                  ? "0"
                  : "-50%"
              }, ${
                direction === "top"
                  ? "-100%"
                  : direction === "bottom"
                  ? "0"
                  : "-50%"
              })`,
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            {t(label)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
