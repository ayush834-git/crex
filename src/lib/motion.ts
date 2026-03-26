export const crexTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };
export const crexStagger = { staggerChildren: 0.08 };

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: crexTransition },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: crexTransition },
};
