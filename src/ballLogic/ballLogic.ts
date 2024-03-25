import {
  circlesInterceptUnitTime,
  interceptLineBallTime,
  reduceSpeed,
} from "./calculates";
import { Line } from "./lines";

const TAU = Math.PI * 2;

export class Ball {
  x: number;
  y: number;
  xSpeed: number = 0;
  ySpeed: number = 0;
  color: string = "red";
  #radius: number = 10;
  #mass: number = 100;
  wallLoss: number = 0.8;
  frameLoss: number = 0.005;
  selected:boolean= false

  constructor({
    x,
    y,
    xSpeed,
    ySpeed,
    radius,
    color,
  }: {
    x: number;
    y: number;
    xSpeed?: number;
    ySpeed?: number;
    radius?: number;
    color?: string;
  }) {
    this.x = x;
    this.y = y;
    if (color) this.color = color;
    if (xSpeed) this.xSpeed = xSpeed;
    if (ySpeed) this.ySpeed = ySpeed;
    if (radius) this.#radius = radius;
    if (radius) this.#mass = radius;
  }

  set radius(radius: number) {
    this.#radius = radius;
    this.#mass = radius ** 2;
  }
  get radius(): number {
    return this.#radius;
  }
  get mass(): number {
    return this.#mass;
  }
  setSpeed(xSpeed: number, ySpeed: number) {
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }
  setSelected = (b:boolean)=>{
    this.selected = b
  }
  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.applySpeedReduction();
  }
  applySpeedReduction() {
    this.setSpeed(
      reduceSpeed(this.xSpeed, this.frameLoss),
      reduceSpeed(this.ySpeed, this.frameLoss)
    );
  }
  draw(ctx: CanvasRenderingContext2D) {
    
    if(this.selected){
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(this.x, this.y, this.radius+5, 0, TAU);
      ctx.fill();
      ctx.closePath();
    }
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, TAU);
    ctx.fill();
    ctx.closePath();
  }
  interceptLineTime(l: Line, time: number) {
    const u = interceptLineBallTime(this, l);
    if (u && u >= time && u <= 1) {
      return u;
    }
  }
  checkBallBallTime(t: number, minTime: number) {
    return t > minTime && t <= 1;
  }
  interceptBallTime(b: Ball, time: number) {
    const x = this.x - b.x;
    const y = this.y - b.y;
    const d = (x * x + y * y) ** 0.5;
    if (d > this.radius + b.radius) {
      const times = circlesInterceptUnitTime(
        this.x,
        this.y,
        this.x + this.xSpeed,
        this.y + this.ySpeed,
        b.x,
        b.y,
        b.x + b.xSpeed,
        b.y + b.ySpeed,
        this.radius,
        b.radius
      );
      if (times.length) {
        if (times.length === 1) {
          if (this.checkBallBallTime(times[0], time)) {
            return times[0];
          }
          return;
        }
        if (times[0] <= times[1]) {
          if (this.checkBallBallTime(times[0], time)) {
            return times[0];
          }
          if (this.checkBallBallTime(times[1], time)) {
            return times[1];
          }
          return;
        }
        if (this.checkBallBallTime(times[1], time)) {
          return times[1];
        }
        if (this.checkBallBallTime(times[0], time)) {
          return times[0];
        }
      }
    }
  }
  collideLine(l: Line, time: number) {
    const x1 = l.x2 - l.x1;
    const y1 = l.y2 - l.y1;
    const d = (x1 * x1 + y1 * y1) ** 0.5;
    const nx = x1 / d;
    const ny = y1 / d;
    const u = (this.xSpeed * nx + this.ySpeed * ny) * 2;
    this.x += this.xSpeed * time;
    this.y += this.ySpeed * time;
    this.xSpeed = (nx * u - this.xSpeed) * this.wallLoss;
    this.ySpeed = (ny * u - this.ySpeed) * this.wallLoss;
    this.x -= this.xSpeed * time;
    this.y -= this.ySpeed * time;
  }
  collide(b: Ball, time: number) {
    const a = this;
    const m1 = a.mass;
    const m2 = b.mass;
    const x = a.x - b.x;
    const y = a.y - b.y;
    const d = x * x + y * y;
    const u1 = (a.xSpeed * x + a.ySpeed * y) / d;
    const u2 = (x * a.ySpeed - y * a.xSpeed) / d;
    const u3 = (b.xSpeed * x + b.ySpeed * y) / d;
    const u4 = (x * b.ySpeed - y * b.xSpeed) / d;
    const mm = m1 + m2;
    const vu3 = ((m1 - m2) / mm) * u1 + ((2 * m2) / mm) * u3;
    const vu1 = ((m2 - m1) / mm) * u3 + ((2 * m1) / mm) * u1;
    a.x = a.x + a.xSpeed * time;
    a.y = a.y + a.ySpeed * time;
    b.x = b.x + b.xSpeed * time;
    b.y = b.y + b.ySpeed * time;
    b.xSpeed = x * vu1 - y * u4;
    b.ySpeed = y * vu1 + x * u4;
    a.xSpeed = x * vu3 - y * u2;
    a.ySpeed = y * vu3 + x * u2;
    a.x = a.x - a.xSpeed * time;
    a.y = a.y - a.ySpeed * time;
    b.x = b.x - b.xSpeed * time;
    b.y = b.y - b.ySpeed * time;
  }
  doesOverlap(ball: Ball) {
    const x = this.x - ball.x;
    const y = this.y - ball.y;
    return this.radius + ball.radius > (x * x + y * y) ** 0.5;
  }
}

export function resolveCollisions(balls: Ball[], lines: Line[]) {
  var minTime = 0,
    minObj,
    minBall,
    resolving = true,
    idx = 0,
    idx1,
    after = 0,
    e = 0;
  while (resolving && e++ < 100) {
    resolving = false;
    minObj = undefined;
    minBall = undefined;
    minTime = 1;
    idx = 0;
    for (const b of balls) {
      idx1 = idx + 1;
      while (idx1 < balls.length) {
        const b1 = balls[idx1++];
        const time = b.interceptBallTime(b1, after);
        if (time !== undefined) {
          if (time <= minTime) {
            minTime = time;
            minObj = b1;
            minBall = b;
            resolving = true;
          }
        }
      }
      for (const l of lines) {
        const time = b.interceptLineTime(l, after);
        if (time !== undefined) {
          if (time <= minTime) {
            minTime = time;
            minObj = l;
            minBall = b;
            resolving = true;
          }
        }
      }
      idx++;
    }
    if (resolving && minBall && minObj) {
      if (minObj instanceof Ball) {
        minBall.collide(minObj, minTime);
      } else {
        minBall.collideLine(minObj, minTime);
      }
      after = minTime;
    }
  }
}
