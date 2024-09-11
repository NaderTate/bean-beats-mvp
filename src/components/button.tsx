// src/components/Button.tsx

import Link from "next/link";
import { motion, MotionProps } from "framer-motion";
import React, { forwardRef, MouseEvent } from "react";

import { FaSpinner } from "react-icons/fa"; // Example using FontAwesome spinner

// Create a type that combines ButtonHTMLAttributes and MotionProps, omitting the conflicting properties
type ButtonMotionProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"
> &
  MotionProps;

interface ButtonProps extends ButtonMotionProps {
  radius?: "sm" | "md" | "lg" | "full";
  color?: string; // Accepts a hex color value
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  children: React.ReactNode;
  as?: "button" | "link"; // Determines if the component renders as a button or link
  href?: string; // Only used when `as` is "link"
  isLoading?: boolean; // New prop to indicate loading state
  textColor?: string; // Accepts a hex color value
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      radius = "md",
      startIcon,
      endIcon,
      children,
      onClick,
      className = "",
      as = "button",
      href = "#",
      textColor,
      isLoading = false, // Default to not loading
      ...rest
    },
    ref
  ) => {
    const radiusClasses = {
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };

    const buttonClasses = `
      button
      ${radiusClasses[radius]} 
      bg-primary
      text-white 
      px-4 
      py-2 
      flex 
      items-center 
      justify-center 
      relative
      overflow-hidden
      ${isLoading ? "cursor-wait" : ""}
      ${textColor ? `text-[${textColor}]` : ""}
      ${className}
    `;

    const commonContent = (
      <>
        {
          isLoading && <FaSpinner className="animate-spin mx-2" /> // Spinner icon with animation
        }
        {startIcon && <span className="mr-2">{startIcon}</span>}
        {children}
        {endIcon && <span className="ml-2">{endIcon}</span>}
      </>
    );

    // Function to handle the ripple effect
    const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
      circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
      circle.classList.add("ripple");

      const ripple = button.getElementsByClassName("ripple")[0];

      if (ripple) {
        ripple.remove();
      }

      button.appendChild(circle);
    };

    if (as === "link" && href) {
      return (
        <Link href={href} passHref>
          <motion.button
            ref={ref as React.Ref<HTMLButtonElement>}
            className={buttonClasses}
            whileTap={{ scale: 0.95 }} // Shrinks the button on press
            onClick={(e) => {
              if (!isLoading) {
                createRipple(e);
                onClick?.(e);
              }
            }}
            disabled={isLoading}
            {...rest}
          >
            {commonContent}
          </motion.button>
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={(e) => {
          if (!isLoading) {
            createRipple(e);
            onClick?.(e);
          }
        }}
        className={buttonClasses}
        whileTap={{ scale: 0.95 }} // Shrinks the button on press
        disabled={isLoading}
        {...rest}
      >
        {commonContent}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
