import { Easing, BezierDefinition } from "framer-motion";
import {
  addOne,
  add,
  multiply,
  divide,
  insertAverages,
  removeAtOddIndexes,
  enclose,
} from "./array";

function xFromT(t: number, bezier: BezierDefinition): number {
  return (
    3 * (1 - t) ** 2 * t * bezier[0] + 3 * (1 - t) * t ** 2 * bezier[2] + t ** 3
  );
}
function yFromT(t: number, bezier: BezierDefinition): number {
  return (
    3 * (1 - t) ** 2 * t * bezier[1] + 3 * (1 - t) * t ** 2 * bezier[3] + t ** 3
  );
}
function xyFromT(t: number, bezier: BezierDefinition): [x: number, y: number] {
  return [xFromT(t, bezier), yFromT(t, bezier)];
}
function yFromX(x: number, bezier: BezierDefinition): number {
  if (x === 0 || x === 1) {
    return x;
  }

  let lower = 0;
  let upper = 1;
  let t = (upper + lower) / 2;
  let nearX = xFromT(t, bezier);

  while (Math.abs(x - nearX) > 0.00001 /* xTolerance adjust as you please */) {
    if (x > nearX) lower = t;
    else upper = t;

    t = (upper + lower) / 2;
    nearX = xFromT(t, bezier);
  }

  return yFromT(t, bezier);
}

function Times(count: number, curve: BezierDefinition): number[] {
  if (count < 4) {
    throw "Times count can't be less than 4";
  }
  const times: number[] = [0];
  for (let index = 1; index < count - 1; index++) {
    times.push(yFromX(index / (count - 1), curve));
  }
  times.push(1);
  return times;
}
function Ease(
  keyframesCount: number,
  start: Easing,
  end: Easing,
  between: Easing
): Easing[] {
  if (keyframesCount < 4) {
    throw "Keyframes count can't be less than 4";
  }
  const ease: Easing[] = [start];
  for (let index = 0; index < keyframesCount - 3; index++) {
    ease.push(between);
  }
  ease.push(end);
  return ease;
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

function BounceTimes(count: number, curve: BezierDefinition): number[] {
  if (count % 2 === 0) {
    throw "Bounce Times count must be odd";
  }
  return BounceTimesFromTimes(Times(Math.round(count / 2), curve));
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
function BounceEase(
  keyframesCount: number,
  start: Easing,
  end: Easing,
  up: Easing,
  down: Easing
): Easing[] {
  if (keyframesCount % 2 === 0) {
    throw "Bounce keyframes count must be odd";
  }
  const ease: Easing[] = [start];
  for (let index = 0; index < keyframesCount / 2 - 2; index++) {
    // -2 not -1 & trunc
    ease.push(down, up);
  }
  ease.push(end);
  return ease;
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
function OffBounceEase(
  keyframesCount: number,
  up: Easing,
  down: Easing
): Easing[] {
  if (keyframesCount % 2 === 0) {
    throw "Off Bounce keyframes count must be odd";
  }
  const ease: Easing[] = ["linear"];
  for (let index = 0; index < keyframesCount / 2 - 2; index++) {
    // -2 not -1 & trunc
    ease.push(up, down);
  }
  ease.push("linear");
  return ease;
}

function BounceDownTimes(count: number, curve: BezierDefinition): number[] {
  if (count % 2 !== 0) {
    throw "Bounce Down times count must be even";
  }
  let times = BounceTimes(count + 1, curve);
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
function BounceDownEase(
  keyframesCount: number,
  start: Easing,
  end: Easing,
  up: Easing,
  down: Easing
): Easing[] {
  if (keyframesCount % 2 !== 0) {
    throw "Bounce Down keyframes count must be even";
  }
  const ease: Easing[] = [start];
  for (let index = 0; index < keyframesCount / 2 - 2; index++) {
    ease.push(up, down);
  }
  ease.push(up, end);
  return ease;
}

function BounceUpTimes(count: number, curve: BezierDefinition): number[] {
  if (count % 2 !== 0) {
    throw "Bounce Up times count must be even";
  }
  const times = BounceTimes(count + 1, curve);
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
function BounceUpEase(
  keyframesCount: number,
  start: Easing,
  end: Easing,
  up: Easing,
  down: Easing
): Easing[] {
  if (keyframesCount % 2 !== 0) {
    throw "Bounce Up keyframes count must be even";
  }
  const ease: Easing[] = [start];
  for (let index = 0; index < keyframesCount / 2 - 2; index++) {
    ease.push(down, up);
  }
  ease.push(down, end);
  return ease;
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
function FlatBounceDownEase(
  keyframesCount: number,
  end: Easing,
  up: Easing,
  down: Easing
): Easing[] {
  if (keyframesCount % 2 === 0) {
    throw "Flat Bounce Down keyframes count must be odd";
  }
  const ease: Easing[] = ["linear"];
  for (let index = 0; index < keyframesCount / 2 - 2; index++) {
    // -2 not -1 & trunc
    ease.push(down, up);
  }
  ease.push(end);
  return ease;
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
function FlatBounceUpEase(
  keyframesCount: number,
  start: Easing,
  up: Easing,
  down: Easing
): Easing[] {
  if (keyframesCount % 2 === 0) {
    throw "Flat Bounce Up keyframes count must be odd";
  }
  const ease: Easing[] = [start];
  for (let index = 0; index < keyframesCount / 2 - 2; index++) {
    // -2 not -1 & trunc
    ease.push(down, up);
  }
  ease.push("linear");
  return ease;
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

function ShockBounceTimes(
  bounceTimes: readonly number[],
  shockCount: number,
  shockCurve: BezierDefinition
): number[] {
  const times: number[] = [0, bounceTimes[1]];
  for (let index = 2; index < bounceTimes.length - 1; index++) {
    times.push(bounceTimes[index]);
    if (index % 2 === 0) {
      let downTimes = BounceDownTimes(shockCount, shockCurve);
      downTimes.shift();
      downTimes.pop();
      downTimes = multiply(
        downTimes,
        bounceTimes[index + 1] - bounceTimes[index]
      );
      times.push(...downTimes.map((value) => bounceTimes[index] + value));
    }
  }
  times.push(1);
  return times;
}
function ShockBounceKeyframes(
  to: number,
  bounceTimes: number[],
  shockCount: number,
  shockCurve: BezierDefinition,
  isOneBased: boolean = false
): number[] {
  if (isOneBased) {
    return addOne(
      ShockBounceKeyframes(to - 1, bounceTimes, shockCount, shockCurve)
    );
  }
  const offKeyframes = OffBounceKeyframes(to, bounceTimes);
  const keyframes: number[] = [0, 0];
  for (let index = 2; index < offKeyframes.length - 1; index++) {
    keyframes.push(offKeyframes[index]);
    if (index % 2 === 0) {
      const downKeyframes = BounceDownKeyframes(
        offKeyframes[index],
        BounceDownTimes(shockCount, shockCurve)
      );
      downKeyframes.shift();
      downKeyframes.pop();
      keyframes.push(...downKeyframes);
    }
  }
  keyframes.push(0);
  return keyframes;
}
function ShockBounceEase(
  bounceKeyframesCount: number,
  up: Easing,
  shockCount: number,
  shockStart: Easing,
  shockEnd: Easing,
  shockUp: Easing,
  shockDown: Easing
): Easing[] {
  if (bounceKeyframesCount % 2 === 0) {
    throw "Bounce keyframes count must be odd";
  }
  const ease: Easing[] = ["linear"];
  const shockEasings = BounceDownEase(
    shockCount,
    shockStart,
    shockEnd,
    shockUp,
    shockDown
  );
  for (let index = 0; index < bounceKeyframesCount / 2 - 2; index++) {
    // -2 not -1 & trunc
    ease.push(up, ...shockEasings);
  }
  ease.push("linear");
  return ease;
}

//--continue

function zigzagTimes(count: number, curve: BezierDefinition): number[] {
  let times = BounceTimes(count * 2 - 3, curve);
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

export {
  xFromT,
  yFromT,
  xyFromT,
  yFromX,
  Times,
  Ease,
  TransformKeyframes,
  BounceTimes,
  BounceTimesFromTimes,
  BounceKeyframes,
  BounceEase,
  OffBounceKeyframes,
  OffBounceEase,
  DualBounceTimes,
  DualBounceKeyframes,
  BounceDownTimes,
  BounceDownKeyframes,
  BounceUpTimes,
  BounceUpKeyframes,
  BounceUpEase,
  FlatBounceDownKeyframes,
  FlatBounceDownEase,
  FlatBounceUpKeyframes,
  FlatBounceUpEase,
  ShockBounceTimes,
  ShockBounceKeyframes,
  ShockBounceEase,
};
