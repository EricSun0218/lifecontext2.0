
import { Variants, Transition } from 'framer-motion';

export const SPRING_TIGHT: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 30
};

export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const FADE_IN_UP_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

export const FADE_IN_UP_ITEM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

export const FAST_CASCADE_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
};

export const FAST_FADE_UP_ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25 
    }
  },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

export const HOVER_ACTION: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: SPRING_TIGHT },
  tap: { scale: 0.95, transition: SPRING_TIGHT }
};

export const HOVER_CARD_GLOW: Variants = {
  initial: { 
    scale: 1, 
    y: 0,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(96, 165, 250, 0.15)",
    boxShadow: "0 0 20px rgba(59,130,246,0.05)"
  },
  hover: { 
    scale: 1.01, 
    y: -4, 
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
    borderColor: "rgba(96, 165, 250, 0.3)",
    boxShadow: "0 0 40px -10px rgba(96,165,250,0.4)",
    transition: SPRING_SOFT
  },
  tap: {
    scale: 0.99,
    transition: SPRING_TIGHT
  }
};

export const HOVER_MENU_ITEM: Variants = {
  initial: { backgroundColor: "rgba(255, 255, 255, 0.05)", x: 0 },
  hover: { 
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
    x: 4,
    transition: { duration: 0.2 }
  },
  tap: { x: 0 }
};

export const MODAL_BACKDROP: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export const MODAL_CONTENT: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: SPRING_SOFT
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

export const NOTIFICATION_PANEL: Variants = {
  hidden: { 
    opacity: 0, 
    x: 100, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: SPRING_SOFT
  },
  exit: { 
    opacity: 0, 
    x: 100, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

export const NOTIFICATION_PANEL_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  }
};

export const NOTIFICATION_ITEM: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: -5,
    transition: { duration: 0.15 }
  }
};
