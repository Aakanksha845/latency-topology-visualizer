"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type TooltipProps = {
  visible: boolean;
  x: number;
  y: number;
  name?: string;
  city?: string;
  region?: string;
  provider?: string;
};

export default function ExchangeTooltip({
  visible,
  x,
  y,
  name,
  city,
  region,
  provider,
}: TooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: y + 10,
            left: x + 10,
            background: "rgba(20, 20, 20, 0.85)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            pointerEvents: "none",
            zIndex: 1000,
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ fontWeight: 600 }}>{name}</div>
          {city && <div>{city}</div>}
          {region && <div>{region}</div>}
          {provider && (
            <div style={{ color: "#aaa", fontSize: "0.8rem" }}>
              Cloud: {provider}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
