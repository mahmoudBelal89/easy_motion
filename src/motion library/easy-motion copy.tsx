import {
  AnimationControls,
  CustomValueType,
  Easing,
  MotionStyle,
  TargetAndTransition,
  Transition,
  VariantLabels,
} from "framer-motion";

const _ease: Easing = [0.25, 0.1, 0.25, 1];

const duration: {
  readonly IIxs: number;
  readonly xs: number;
  readonly sm: number;
  readonly base: number;
  readonly lg: number;
  readonly xl: number;
} = {
  IIxs: 0.3,
  xs: 0.45,
  sm: 0.6,
  base: 0.8,
  lg: 1,
  xl: 1.2,
};

interface EasyMotion {
  style?: MotionStyle;
  animate: TargetAndTransition;
  transition: Transition;
}
interface EmphasisMotion extends EasyMotion {}

function _bounceFactory(size: number, duration: number): EmphasisMotion {
  return {
    style: { originY: 1 },
    animate: {
      y: [0, 0, -30, -30, 0, -15, 0, -4, 0].map((value) => value * size),
      scaleY: [1, 1, 1.1, 1.1, 1, 1.05, 0.95, 1.02, 1].map((value) =>
        value >= 1 ? 1 + (value - 1) * size : 1 - (1 - value) * size
      ),
    },
    transition: {
      type: "tween",
      duration: duration,
      times: [0, 0.2, 0.4, 0.43, 0.53, 0.7, 0.8, 0.9, 1],
      ease: [
        "linear",
        [0.215, 0.61, 0.355, 1],
        "linear",
        [0.755, 0.05, 0.855, 0.06],
        [0.215, 0.61, 0.355, 1],
        [0.755, 0.05, 0.855, 0.06],
        [0.215, 0.61, 0.355, 1],
        [0.215, 0.61, 0.355, 1],
      ],
    },
  };
}

const bounceIIXL: EmphasisMotion = _bounceFactory(8, duration.xl);

const bounce: EmphasisMotion = {
  style: { originY: 1 },
  animate: {
    y: [0, 0, -30, -30, 0, -15, 0, -4, 0],
    scaleY: [1, 1, 1.1, 1.1, 1, 1.05, 0.95, 1.02, 1],
  },
  transition: {
    type: "tween",
    duration: duration.base,
    times: [0, 0.2, 0.4, 0.43, 0.53, 0.7, 0.8, 0.9, 1],
    ease: [
      "linear",
      [0.215, 0.61, 0.355, 1],
      "linear",
      [0.755, 0.05, 0.855, 0.06],
      [0.215, 0.61, 0.355, 1],
      [0.755, 0.05, 0.855, 0.06],
      [0.215, 0.61, 0.355, 1],
      [0.215, 0.61, 0.355, 1],
    ],
  },
};

const bounceSM: EmphasisMotion = {
  style: { originY: 1 },
  animate: {
    y: [0, 0, -15, -15, 0, -7.5, 0, -2, 0],
    scaleY: [1, 1, 1.05, 1.05, 1, 1.025, 0.975, 1.01, 1],
  },
  transition: {
    type: "tween",
    duration: duration.sm,
    times: [0, 0.2, 0.4, 0.43, 0.53, 0.7, 0.8, 0.9, 1],
    ease: [
      "linear",
      [0.215, 0.61, 0.355, 1],
      "linear",
      [0.755, 0.05, 0.855, 0.06],
      [0.215, 0.61, 0.355, 1],
      [0.755, 0.05, 0.855, 0.06],
      [0.215, 0.61, 0.355, 1],
      [0.215, 0.61, 0.355, 1],
    ],
  },
};

const bounceLG: EmphasisMotion = {
  style: { originY: 1 },
  animate: {
    y: [0, 0, -60, -60, 0, -30, 0, -8, 0],
    scaleY: [1, 1, 1.2, 1.2, 1, 1.1, 0.9, 1.04, 1],
  },
  transition: {
    type: "tween",
    duration: duration.lg,
    times: [0, 0.2, 0.4, 0.43, 0.53, 0.7, 0.8, 0.9, 1],
    ease: [
      "linear",
      [0.215, 0.61, 0.355, 1],
      "linear",
      [0.755, 0.05, 0.855, 0.06],
      [0.215, 0.61, 0.355, 1],
      [0.755, 0.05, 0.855, 0.06],
      [0.215, 0.61, 0.355, 1],
      [0.215, 0.61, 0.355, 1],
    ],
  },
};

const bounceXL: EmphasisMotion = {
  style: { originY: 1 },
  animate: {
    y: [0, 0, -120, -120, 0, -60, 0, -16, 0],
    scaleY: [1, 1, 1.4, 1.4, 1, 1.2, 0.8, 1.08, 1],
  },
  transition: {
    type: "tween",
    duration: duration.xl,
    times: [0, 0.2, 0.4, 0.43, 0.53, 0.7, 0.8, 0.9, 1],
    ease: [
      "linear",
      [0.215, 0.61, 0.355, 1],
      "linear",
      [0.755, 0.05, 0.855, 0.06],
      [0.215, 0.61, 0.355, 1],
      [0.755, 0.05, 0.855, 0.06],
      [0.215, 0.61, 0.355, 1],
      [0.215, 0.61, 0.355, 1],
    ],
  },
};

const pulseEmphasisMotion: EmphasisMotion = {
  animate: { scale: [null, 1.05, 1] },
  transition: { type: "tween", duration: duration.base, ease: "easeInOut" },
};

const rubberBandEmphasisMotion: EmphasisMotion = {
  animate: {
    scaleX: [null, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
    scaleY: [null, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
  },
  transition: {
    type: "tween",
    duration: duration.xl,
    times: [0, 0.3, 0.4, 0.5, 0.65, 0.75, 1],
    ease: _ease,
  },
};

const tadaEmphasisMotion: EmphasisMotion = {
  animate: {
    scale: [null, 0.9, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
    rotateZ: [null, -3, -3, 3, -3, 3, -3, 3, -3, 3, 0],
  },
  transition: {
    type: "tween",
    duration: duration.xl,
    times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    ease: _ease,
  },
};

const wobbleEmphasisMotion: EmphasisMotion = {
  animate: {
    x: [null, -25, 20, -15, 10, -5, 0],
    //x: ["0%", "-25%", "20%", "-15%", "10%", "-5%", "0%"],
    rotateZ: [null, -5, 3, -3, 2, -1, 0],
  },
  transition: {
    type: "tween",
    duration: duration.xl,
    times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
    ease: _ease,
  },
};

const shakeXEmphasisMotion: EmphasisMotion = {
  animate: {
    x: [null, -10, 10, -10, 10, -10, 10, -10, 10, -10, 0],
  },
  transition: {
    type: "tween",
    duration: duration.xl,
    times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    ease: _ease,
  },
};

const shakeYEmphasisMotion: EmphasisMotion = {
  animate: {
    y: [null, -10, 10, -10, 10, -10, 10, -10, 10, -10, 0],
  },
  transition: {
    type: "tween",
    duration: duration.xl,
    times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    ease: _ease,
  },
};

const swingEmphasisMotion: EmphasisMotion = {
  style: { originY: 0 },
  animate: {
    rotateZ: [null, 15, -10, 5, -5, 0],
  },
  transition: {
    type: "tween",
    duration: duration.lg,
    ease: _ease,
  },
};

const jelloEmphasisMotion: EmphasisMotion = {
  animate: {
    skewX: [
      null,
      0,
      -12.5,
      6.25,
      -3.125,
      1.5625,
      -0.78125,
      0.390625,
      -0.1953125,
      0,
    ],
    skewY: [
      null,
      0,
      -12.5,
      6.25,
      -3.125,
      1.5625,
      -0.78125,
      0.390625,
      -0.1953125,
      0,
    ],
  },
  transition: {
    type: "tween",
    duration: duration.xl,
    times: [0, 0.111, 0.222, 0.333, 0.444, 0.555, 0.666, 0.777, 0.888, 1],
    ease: _ease,
  },
};

const heartBeatEmphasisMotion: EmphasisMotion = {
  style: { originX: 0.5, originY: 0.5 },
  animate: {
    scale: [null, 1.3, 1, 1.3, 1, 1],
  },
  transition: {
    type: "tween",
    duration: duration.lg,
    times: [0, 0.14, 0.28, 0.42, 0.7, 1],
    ease: "easeInOut",
  },
};

export type { EasyMotion, EmphasisMotion };
export {
  duration,
  bounce,
  bounceSM,
  bounceLG,
  bounceXL,
  bounceIIXL,
  pulseEmphasisMotion,
  rubberBandEmphasisMotion,
  tadaEmphasisMotion,
  wobbleEmphasisMotion,
  shakeXEmphasisMotion,
  shakeYEmphasisMotion,
  swingEmphasisMotion,
  jelloEmphasisMotion,
  heartBeatEmphasisMotion,
};
