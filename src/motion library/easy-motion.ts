import { Easing, BezierDefinition } from "framer-motion";
import {
  BounceEase,
  BounceKeyframes,
  BounceTimes,
  OffBounceEase,
  OffBounceKeyframes,
  ShockBounceEase,
  ShockBounceKeyframes,
  ShockBounceTimes,
} from "../math/easy-motion-factory";

// from easings.net
const EASE_IN_SINE: BezierDefinition = [0.12, 0, 0.39, 0];
const EASE_OUT_SINE: BezierDefinition = [0.61, 1, 0.88, 1];
const EASE_IN_OUT_SINE: BezierDefinition = [0.37, 0, 0.63, 1];
const EASE_IN_QUAD: BezierDefinition = [0.11, 0, 0.5, 0];
const EASE_OUT_QUAD: BezierDefinition = [0.5, 1, 0.89, 1];
const EASE_IN_OUT_QUAD: BezierDefinition = [0.45, 0, 0.55, 1];
const EASE_IN_CUBIC: BezierDefinition = [0.32, 0, 0.67, 0];
const EASE_OUT_CUBIC: BezierDefinition = [0.33, 1, 0.68, 1];
const EASE_IN_OUT_CUBIC: BezierDefinition = [0.65, 0, 0.35, 1];
const EASE_IN_QUART: BezierDefinition = [0.5, 0, 0.75, 0];
const EASE_OUT_QUART: BezierDefinition = [0.25, 1, 0.5, 1];
const EASE_IN_OUT_QUART: BezierDefinition = [0.76, 0, 0.24, 1];

// by mahmoud belal
const EASE_IN_TINY: BezierDefinition = [0.5, 0.3, 0.7, 0.5];
const EASE_OUT_TINY: BezierDefinition = [0.3, 0.5, 0.5, 0.7];
const EASE_IN_ROUNDISH: BezierDefinition = [0.4, 0.05, 0.75, 0.4];
const EASE_OUT_ROUNDISH: BezierDefinition = [0.25, 0.6, 0.6, 0.95];
const EASE_IN_EARLY_END: BezierDefinition = [0.7, 0.5, 0.3, 1];
const EASE_IN_EARLIER_END: BezierDefinition = [0.65, 0.5, 0.15, 1];
const EASE_OUT_LATE_START: BezierDefinition = [0.65, 0, 0.35, 0.5];
const EASE_OUT_LATER_START: BezierDefinition = [0.85, 0, 0.35, 0.5];

const EASE_RIPPLE: BezierDefinition = [1, 1.67, 0, -0.67];
const easeSudden: BezierDefinition = [0, 1, 0, 1];
const easeElastic: BezierDefinition = [0, 1.67, 1, 1.67];

interface EasyMotion {}
interface EmphasisMotion extends EasyMotion {}

class Bounce implements EmphasisMotion {
  readonly originY: number = 1;
  readonly times: number[];
  readonly yKeyframes: number[];
  readonly yEase: Easing[];
  readonly scaleXKeyframes: number[];
  readonly scaleXEase: Easing[];
  readonly scaleYKeyframes: number[];
  readonly scaleYEase: Easing[];

  constructor(
    curve: BezierDefinition,
    count: number,
    y: number,
    scaleX: number,
    scaleY: number
  ) {
    if (scaleX < 1) {
      throw "Bounce Scale X must be greater than 1";
    }
    if (scaleY > 1) {
      throw "Bounce Scale Y must be less than 1";
    }
    this.times = BounceTimes(1 + count * 2, curve);
    this.yKeyframes = BounceKeyframes(y, this.times);
    this.yEase = BounceEase(
      this.yKeyframes.length,
      EASE_OUT_LATE_START,
      EASE_IN_EARLY_END,
      EASE_OUT_LATE_START,
      EASE_IN_EARLY_END
    );
    this.scaleXKeyframes = OffBounceKeyframes(scaleX, this.times, true);
    this.scaleXEase = OffBounceEase(
      this.scaleXKeyframes.length,
      EASE_IN_SINE,
      EASE_OUT_SINE
    );
    this.scaleYKeyframes = OffBounceKeyframes(scaleY, this.times, true);
    this.scaleYEase = OffBounceEase(
      this.scaleYKeyframes.length,
      EASE_IN_SINE,
      EASE_OUT_SINE
    );
  }
}

class ShockBounce implements EmphasisMotion {
  readonly originY: number = 1;
  readonly bounceTimes: number[];
  readonly yKeyframes: number[];
  readonly yEase: Easing[];
  readonly shockBounceTimes: number[];
  readonly scaleXKeyframes: number[];
  readonly scaleXEase: Easing[];
  readonly scaleYKeyframes: number[];
  readonly scaleYEase: Easing[];

  constructor(
    curve: BezierDefinition,
    count: number,
    y: number,
    scaleX: number,
    scaleY: number,
    shockCount: number
  ) {
    if (scaleX < 1) {
      throw "Shock Bounce Scale X must be greater than 1";
    }
    if (scaleY > 1) {
      throw "Shock Bounce Scale Y must be less than 1";
    }
    this.bounceTimes = BounceTimes(1 + count * 2, curve);
    this.yKeyframes = BounceKeyframes(y, this.bounceTimes);
    this.yEase = BounceEase(
      this.yKeyframes.length,
      EASE_OUT_LATE_START,
      EASE_IN_EARLY_END,
      EASE_OUT_LATE_START,
      EASE_IN_EARLY_END
    );
    this.shockBounceTimes = ShockBounceTimes(
      this.bounceTimes,
      shockCount,
      EASE_OUT_LATER_START
    );
    this.scaleXKeyframes = ShockBounceKeyframes(
      scaleX,
      this.bounceTimes,
      shockCount,
      EASE_OUT_LATER_START,
      true
    );
    this.scaleXEase = ShockBounceEase(
      this.yKeyframes.length,
      EASE_IN_TINY,
      shockCount,
      EASE_OUT_SINE,
      EASE_IN_SINE,
      EASE_OUT_SINE,
      EASE_IN_SINE
    );
    this.scaleYKeyframes = ShockBounceKeyframes(
      scaleY,
      this.bounceTimes,
      shockCount,
      EASE_OUT_LATER_START,
      true
    );
    this.scaleYEase = ShockBounceEase(
      this.yKeyframes.length,
      EASE_IN_TINY,
      shockCount,
      EASE_OUT_SINE,
      EASE_IN_SINE,
      EASE_OUT_SINE,
      EASE_IN_SINE
    );
  }
}

export type { EasyMotion, EmphasisMotion };
export { Bounce, ShockBounce };
