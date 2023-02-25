import { useState } from "react";
import "./App.css";
import {
  easeIn,
  easeOut,
  Easing,
  motion,
  Transition,
  useAnimationControls,
} from "framer-motion";
import {
  bounceDownKeyframes,
  bounceDownTimes,
  bounceKeyframes,
  bounceTimes,
  bounceTimesFromTimes,
  CubicBezierEasingCurve,
  flatBounceDownKeyframes,
  offBounceKeyframes,
  shockBounceKeyframes,
  shockBounceTimes,
  times,
  transformKeyframes,
} from "./math/cubic-bezier-easing-curve";

function App() {
  const [on, setOn] = useState(false);

  const easeInSine: CubicBezierEasingCurve = [0.12, 0, 0.39, 0];
  const easeInQuad: CubicBezierEasingCurve = [0.11, 0, 0.5, 0];
  const easeInCirc: CubicBezierEasingCurve = [0.55, 0, 1, 0.45];
  const easeInCubic: CubicBezierEasingCurve = [0.32, 0, 0.67, 0];
  const easeInQuart: CubicBezierEasingCurve = [0.5, 0, 0.75, 0];
  const easeInQuint: CubicBezierEasingCurve = [0.64, 0, 0.78, 0];
  const easeInExpo: CubicBezierEasingCurve = [0.7, 0, 0.84, 0];
  const easeOutSine: CubicBezierEasingCurve = [0.61, 1, 0.88, 1];
  const easeOutCirc: CubicBezierEasingCurve = [0, 0.55, 0.45, 1];
  const easeOutQuad: CubicBezierEasingCurve = [0.5, 1, 0.89, 1];
  const easeOutCubic: CubicBezierEasingCurve = [0.33, 1, 0.68, 1];
  const easeOutQuart: CubicBezierEasingCurve = [0.25, 1, 0.5, 1];
  const easeInOutSine: CubicBezierEasingCurve = [0.37, 0, 0.63, 1];

  const easeOutMagic: CubicBezierEasingCurve = [0.25, 0.6, 0.6, 0.95];
  const easeOutHighEnd: CubicBezierEasingCurve = [0.3, 0.5, 0.5, 0.7];
  const easeInEarlyEnd: CubicBezierEasingCurve = [0.7, 0.5, 0.3, 1];
  const easeInEarlierEnd: CubicBezierEasingCurve = [0.65, 0.5, 0.15, 1];
  const easeOutLateStart: CubicBezierEasingCurve = [0.65, 0, 0.35, 0.5];
  const easeOutLaterStart: CubicBezierEasingCurve = [0.85, 0, 0.35, 0.5];

  const easeRipple: CubicBezierEasingCurve = [1, 1.67, 0, -0.67];
  const easeSudden: CubicBezierEasingCurve = [0, 1, 0, 1];
  const easeElastic: CubicBezierEasingCurve = [0, 1.67, 1, 1.67];

  function bounceEase(count: number, up: Easing, down: Easing): Easing[] {
    const ease: Easing[] = [];
    for (let index = 0; index < count / 2; index++) {
      ease.push(up, down);
    }
    return ease;
  }
  function offBounceEase(count: number, up: Easing, down: Easing): Easing[] {
    const ease: Easing[] = bounceEase(count - 2, up, down);
    ease.unshift("linear");
    ease.push("linear");
    return ease;
  }
  function shockBounceEase(
    count: number,
    up: Easing,
    rippleDown: Easing,
    rippleUp: Easing,
    down: Easing
  ): Easing[] {
    const ease: Easing[] = ["linear"];
    for (let index = 0; index < (count - 1) / 4; index++) {
      ease.push(up, rippleDown, rippleUp, down);
    }
    return ease;
  }

  const t = times(10, easeOutHighEnd);
  const tBounce = bounceTimesFromTimes(t);
  const tShock = shockBounceTimes(tBounce, 8, easeOutHighEnd);

  const kBounce = bounceKeyframes(-200, tBounce);
  const kShock = shockBounceKeyframes(2, tBounce, 8, easeOutHighEnd, true);

  console.log("times");
  console.log(t);
  console.log("bounce");
  console.log(tBounce);
  console.log(kBounce);
  console.log("shock");
  console.log(tShock);
  console.log(kShock);

  return (
    <div className="flex flex-col h-screen md:flex after:first:last:-row">
      <motion.div
        className="w-16 h-16 mx-10 my-auto bg-red-600 shadow-lg shadow-gray-700 rounded-full"
        style={{ originX: 0.5, originY: 1 }}
        onClick={() => {
          setOn(!on);
        }}
        animate={
          on
            ? {
                y: kBounce,
                scale: kShock,
                transition: {
                  y: { times: tBounce, duration: 5 },
                  scale: { times: tShock, duration: 5 },
                },
              }
            : {}
        }
      />
    </div>
  );
}

export default App;

"Test Git"
