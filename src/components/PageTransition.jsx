import React from "react";
import { motion } from "framer-motion";
import { useNavigation } from "./MobileStackManager";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const { direction } = useNavigation();
  const location = useLocation();

  const variants = {
    enter: (direction) => ({
      x: direction === "forward" ? "100%" : "-20%",
      opacity: 0,
      position: "absolute",
      width: "100%"
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      width: "100%"
    },
    exit: (direction) => ({
      x: direction === "forward" ? "-20%" : "100%",
      opacity: 0,
      position: "absolute",
      width: "100%"
    })
  };

  return (
    <motion.div
      key={location.pathname}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      variants={variants}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
    >
      {children}
    </motion.div>
  );
}