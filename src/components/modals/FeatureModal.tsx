"use client";

import { useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function FeatureModal({ open, onClose, title, children }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={backdropRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8"
          style={{ background: "rgba(8,12,24,0.92)" }}
          onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: "#F5C518", border: "4px solid #1A1AE6", boxShadow: "8px 8px 0 #1A1AE6" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ borderBottom: "3px solid #1A1AE6" }}>
              <h2 className="text-2xl font-black uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#1A1AE6" }}>
                {title}
              </h2>
              <button onClick={onClose} className="p-2 cursor-pointer hover:opacity-70 transition-opacity" style={{ background: "#1A1AE6", border: "2px solid #080C18" }}>
                <X size={20} color="#FFFFFF" />
              </button>
            </div>
            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
