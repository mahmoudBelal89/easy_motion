import { useState } from "react";
import "./App.css";
import {
  easeIn,
  easeOut,
  Easing,
  motion,
  Transition,
  useAnimationControls,
  BezierDefinition,
  easeInOut,
} from "framer-motion";
import {
  BounceDownKeyframes,
  BounceDownTimes,
  BounceEase,
  BounceKeyframes,
  BounceTimes,
  BounceTimesFromTimes,
  BounceUpKeyframes,
  BounceUpTimes,
  DualBounceKeyframes,
  DualBounceTimes,
  FlatBounceDownKeyframes,
  FlatBounceUpKeyframes,
  OffBounceKeyframes,
  ShockBounceEase,
  ShockBounceKeyframes,
  ShockBounceTimes,
  Times,
} from "./math/easy-motion-factory";
import {
  Bounce,
  EmphasisMotion,
  ShockBounce,
} from "./motion library/easy-motion";

function App() {
  const [on, setOn] = useState(false);

  console.log("add more commit");

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

  const duration: number = 5;
  const bounce: Bounce = new Bounce(EASE_OUT_QUART, 20, -200, 1.5, 0.6);
  const customTimes: number[] = BounceTimes(41, EASE_OUT_SINE);
  const shockBounce: ShockBounce = new ShockBounce(
    [0.3, 0.5, 0.5, 0.7],
    10,
    -200,
    1.5,
    0.6,
    6
  );

  return (
    <div className="flex flex-row h-screen md:flex after:first:last:-row">
      <motion.div
        className="w-16 h-16 mx-10 my-auto bg-red-600 shadow-lg shadow-gray-700 rounded-full"
        style={{ originY: bounce.originY }}
        onClick={() => {
          setOn(!on);
        }}
        animate={
          on
            ? {
                y: bounce.yKeyframes,
                scaleX: bounce.scaleXKeyframes,
                scaleY: bounce.scaleYKeyframes,
                transition: {
                  y: {
                    type: "keyframes",
                    duration: duration,
                    times: bounce.times,
                    //times: customTimes,
                    ease: bounce.yEase,
                  },
                  scaleX: {
                    type: "keyframes",
                    duration: duration,
                    times: bounce.times,
                    //times: customTimes,
                    ease: bounce.scaleXEase,
                  },
                  scaleY: {
                    type: "keyframes",
                    duration: duration,
                    times: bounce.times,
                    //times: customTimes,
                    ease: bounce.scaleYEase,
                  },
                },
              }
            : {}
        }
      />
      <motion.div
        className="w-16 h-16 mx-10 my-auto bg-green-600 shadow-lg shadow-gray-700 rounded-full"
        style={{ originY: bounce.originY }}
        onClick={() => {
          setOn(!on);
        }}
        animate={
          on
            ? {
                y: bounce.yKeyframes,
                scaleX: bounce.scaleXKeyframes,
                scaleY: bounce.scaleYKeyframes,
                transition: {
                  y: {
                    type: "keyframes",
                    duration: duration,
                    //times: bounce.times,
                    times: customTimes,
                    ease: bounce.yEase,
                  },
                  scaleX: {
                    type: "keyframes",
                    duration: duration,
                    //times: bounce.times,
                    times: customTimes,
                    ease: bounce.scaleXEase,
                  },
                  scaleY: {
                    type: "keyframes",
                    duration: duration,
                    //times: bounce.times,
                    times: customTimes,
                    ease: bounce.scaleYEase,
                  },
                },
              }
            : {}
        }
      />
      <motion.div
        className="w-16 h-16 mx-10 my-auto bg-blue-600 shadow-lg shadow-gray-700 rounded-full"
        style={{ originY: bounce.originY }}
        onClick={() => {
          setOn(!on);
        }}
        animate={
          on
            ? {
                y: bounce.yKeyframes,
                scaleX: bounce.scaleXKeyframes,
                scaleY: bounce.scaleYKeyframes,
                transition: {
                  y: {
                    type: "keyframes",
                    duration: duration,
                    //times: bounce.times,
                    //times: customTimes,
                    ease: bounce.yEase,
                  },
                  scaleX: {
                    type: "keyframes",
                    duration: duration,
                    //times: bounce.times,
                    //times: customTimes,
                    ease: bounce.scaleXEase,
                  },
                  scaleY: {
                    type: "keyframes",
                    duration: duration,
                    //times: bounce.times,
                    //times: customTimes,
                    ease: bounce.scaleYEase,
                  },
                },
              }
            : {}
        }
      />
    </div>
  );
}

export default App;
