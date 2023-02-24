import { Easing } from "framer-motion";
import {
  addOne,
  add,
  multiply,
  divide,
  insertAverages,
  removeAtOddIndexes,
  enclose,
} from "./array";

type CubicBezierEasingCurve = [x1: number, y1: number, x2: number, y2: number];

function xFromT(t: number, easing: CubicBezierEasingCurve): number {
  return (
    3 * (1 - t) ** 2 * t * easing[0] + 3 * (1 - t) * t ** 2 * easing[2] + t ** 3
  );
}
function yFromT(t: number, easing: CubicBezierEasingCurve): number {
  return (
    3 * (1 - t) ** 2 * t * easing[1] + 3 * (1 - t) * t ** 2 * easing[3] + t ** 3
  );
}
function xyFromT(
  t: number,
  easing: CubicBezierEasingCurve
): [x: number, y: number] {
  return [xFromT(t, easing), yFromT(t, easing)];
}
function yFromX(x: number, easing: CubicBezierEasingCurve): number {
  if (x === 0 || x === 1) {
    return x;
  }

  let lower = 0;
  let upper = 1;
  let t = (upper + lower) / 2;
  let nearX = xFromT(t, easing);

  while (Math.abs(x - nearX) > 0.00001 /* xTolerance adjust as you please */) {
    if (x > nearX) lower = t;
    else upper = t;

    t = (upper + lower) / 2;
    nearX = xFromT(t, easing);
  }

  return yFromT(t, easing);
}

function Times(count: number, easing: CubicBezierEasingCurve): number[] {
  const times: number[] = [0];
  for (let index = 1; index < count - 1; index++) {
    times.push(yFromX(index / (count - 1), easing));
  }
  times.push(1);
  return times;
}
function Easings(
  keyframesCount: number,
  start: Easing,
  end: Easing,
  between: Easing
): Easing[] {
  const easings: Easing[] = [start];
  for (let index = 0; index < keyframesCount - 3; index++) {
    easings.push(between);
  }
  easings.push(end);
  return easings;
}

function TransformKeyframes(
  to: number,
  times: readonly number[],
  isOneBased: boolean = false
): number[] {
  if (isOneBased) {
    return addOne(TransformKeyframes(to - 1, times));
  }
  return multiply(times, to);
}

function BounceTimes(n: number, easing: CubicBezierEasingCurve): number[] {
  return BounceTimesFromTimes(Times(Math.round(n / 2), easing));
}
function BounceTimesFromTimes(times: readonly number[]): number[] {
  return insertAverages(times);
}
function BounceKeyframes(
  to: number,
  bounceTimes: readonly number[],
  isOneBased: boolean = false
): number[] {
  if (isOneBased) {
    return addOne(BounceKeyframes(to - 1, bounceTimes));
  }
  const times: number[] = removeAtOddIndexes(bounceTimes);
  const keyframes: number[] = [];
  for (let index = 1; index < times.length; index++) {
    keyframes.push(times[index] - times[index - 1]);
  }
  return enclose(multiply(keyframes, to / Math.max(...keyframes)), 0);
}

function OffBounceKeyframes(
  to: number,
  bounceTimes: readonly number[],
  isOneBased: boolean = false
): number[] {
  if (isOneBased) {
    return addOne(OffBounceKeyframes(to - 1, bounceTimes));
  }
  const keyframes: number[] = BounceKeyframes(to, bounceTimes);
  keyframes.unshift(0);
  keyframes.splice(-2, 1);
  return keyframes;
}

function DualBounceTimes(bounceTimes: readonly number[]): number[] {
  return [0, ...insertAverages(bounceTimes.slice(1, -1)), 1];
}
function DualBounceKeyframes(
  to: number,
  bounceTimes: readonly number[],
  isOneBased: boolean = false
): number[] {
  if (isOneBased) {
    return addOne(DualBounceKeyframes(to - 1, bounceTimes));
  }
  const bounce_keyframes: number[] = BounceKeyframes(to, bounceTimes);
  const keyframes: number[] = [];
  for (let index = 0; index < bounce_keyframes.length; index++) {
    if (index % 2 !== 0) {
      keyframes.push(
        bounce_keyframes[index - 1],
        bounce_keyframes[index],
        bounce_keyframes[index - 1],
        bounce_keyframes[index]
      );
    }
  }
  keyframes.push(bounce_keyframes.at(-1)!);
  return keyframes;
}

function BounceDownTimes(n: number, easing: CubicBezierEasingCurve): number[] {
  let times = BounceTimes(n + 1, easing);
  times.shift();
  times = times.map((value) => (value - times[0]) / (1 - times[0]));
  return times;
}
function BounceDownKeyframes(
  to: number,
  bounceDownTimes: readonly number[],
  isOneBased: boolean = false
): number[] {
  if (isOneBased) {
    return addOne(BounceDownKeyframes(to - 1, bounceDownTimes));
  }
  let times: number[] = [...bounceDownTimes];
  times = add(times, times[1]);
  times.unshift(0);
  const keyframes = BounceKeyframes(to, times, isOneBased);
  keyframes.shift();
  return keyframes;
}

function BounceUpTimes(n: number, easing: CubicBezierEasingCurve): number[] {
  const times = BounceTimes(n, easing);
  times.pop();
  return divide(times, times.at(-1)!);
}
function BounceUpKeyframes(
  to: number,
  bounceUpTimes: readonly number[],
  isOneBased: boolean = false
): number[] {
  if (isOneBased) {
    return addOne(BounceUpKeyframes(to - 1, bounceUpTimes));
  }
  const keyframes = BounceKeyframes(
    to,
    [...bounceUpTimes, 1 + (1 - bounceUpTimes.at(-2)!)],
    isOneBased
  );
  keyframes.pop();
  return keyframes;
}

function FlatBounceDownKeyframes(
  to: number,
  bounceTimes: readonly number[],
  isOneBased: boolean = false
): number[] {
  if (isOneBased) {
    return addOne(FlatBounceDownKeyframes(to - 1, bounceTimes));
  }
  const keyframes: number[] = BounceKeyframes(to, bounceTimes);
  keyframes[0] = keyframes[1];
  return keyframes;
}

function FlatBounceUpKeyframes(
  to: number,
  bounceTimes: readonly number[],
  isOneBased: boolean = false
): number[] {
  if (isOneBased) {
    return addOne(FlatBounceUpKeyframes(to - 1, bounceTimes));
  }
  const keyframes: number[] = BounceKeyframes(to, bounceTimes);
  keyframes[keyframes.length - 1] = keyframes.at(-2)!;
  return keyframes;
}

function ShockBounceTimes(
  bounce_times: readonly number[],
  shockN: number,
  shockEasing: CubicBezierEasingCurve
): number[] {
  const times: number[] = [0, bounce_times[1]];
  for (let index = 2; index < bounce_times.length - 1; index++) {
    times.push(bounce_times[index]);
    if (index % 2 === 0) {
      let downTimes = BounceDownTimes(shockN, shockEasing);
      downTimes.shift();
      downTimes.pop();
      downTimes = multiply(
        downTimes,
        bounce_times[index + 1] - bounce_times[index]
      );
      times.push(...downTimes.map((value) => bounce_times[index] + value));
    }
  }
  times.push(1);
  return times;
}
function ShockBounceKeyframes(
  to: number,
  bounce_times: number[],
  shockN: number,
  shockEasing: CubicBezierEasingCurve,
  isOneBased: boolean = false
): number[] {
  if (isOneBased) {
    return addOne(
      ShockBounceKeyframes(to - 1, bounce_times, shockN, shockEasing)
    );
  }
  const offKeyframes = OffBounceKeyframes(to, bounce_times);
  const keyframes: number[] = [0, 0];
  for (let index = 2; index < offKeyframes.length - 1; index++) {
    keyframes.push(offKeyframes[index]);
    if (index % 2 === 0) {
      const downKeyframes = BounceDownKeyframes(
        offKeyframes[index],
        BounceDownTimes(shockN, shockEasing)
      );
      downKeyframes.shift();
      downKeyframes.pop();
      keyframes.push(...downKeyframes);
    }
  }
  keyframes.push(0);
  return keyframes;
}

//--continue

function zigzagTimes(count: number, easing: CubicBezierEasingCurve): number[] {
  let times = BounceTimes(count * 2 - 3, easing);
  times = times.filter((value, index) => {
    if (index === 0 || index === times.length - 1) return true;
    if (index % 2 !== 0) return true;
  });
  return times;
}
function bounceTimesFromZigzagTimes(zigzagTimes: number[]): number[] {
  const times: number[] = [];
  let diff = zigzagTimes[1];
  let recent: number = 0;
  for (let index = 1; index < zigzagTimes.length - 2; index++) {
    recent = zigzagTimes[index] + diff;
    times.push(recent);
    diff = zigzagTimes[index + 1] - recent;
  }
  const result: number[] = [zigzagTimes[0], zigzagTimes[1]];
  for (let index = 0; index < times.length; index++) {
    result.push(times[index], zigzagTimes[index + 2]);
  }
  result.push(zigzagTimes[zigzagTimes.length - 1]);
  return result;
}
function zigzagKeyframes(to: number, zigzagTimes: number[]): number[] {
  const bounce_times = removeAtOddIndexes(
    bounceTimesFromZigzagTimes(zigzagTimes)
  );
  let keyframes: number[] = [];
  for (let index = 1; index < bounce_times.length; index++) {
    if (index % 2 === 0) {
      keyframes.push(-(bounce_times[index] - bounce_times[index - 1]));
    } else {
      keyframes.push(bounce_times[index] - bounce_times[index - 1]);
    }
  }
  return [0, ...multiply(keyframes, to / Math.max(...keyframes)), 0];
}
function scaleZigzagKeyframes(to: number, zigzagTimes: number[]): number[] {
  return addOne(zigzagKeyframes(to - 1, zigzagTimes));
}

export type { CubicBezierEasingCurve };
export {
  xFromT,
  yFromT,
  xyFromT,
  yFromX,
  Times as times,
  TransformKeyframes as transformKeyframes,
  BounceTimes as bounceTimes,
  BounceTimesFromTimes as bounceTimesFromTimes,
  BounceKeyframes as bounceKeyframes,
  OffBounceKeyframes as offBounceKeyframes,
  DualBounceTimes as dualBounceTimes,
  DualBounceKeyframes as dualBounceKeyframes,
  BounceDownTimes as bounceDownTimes,
  BounceDownKeyframes as bounceDownKeyframes,
  BounceUpTimes as bounceUpTimes,
  BounceUpKeyframes as bounceUpKeyframes,
  FlatBounceDownKeyframes as flatBounceDownKeyframes,
  FlatBounceUpKeyframes as flatBounceUpKeyframes,
  ShockBounceTimes as shockBounceTimes,
  ShockBounceKeyframes as shockBounceKeyframes,
};
