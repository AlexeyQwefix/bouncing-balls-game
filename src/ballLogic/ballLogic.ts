import { BallType } from "../types/BallType";
import { calcPosition, calcSpeed } from "./calculates";

export const clear = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "#31363f";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const drawBall = (ctx: CanvasRenderingContext2D, ball: BallType) => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  ctx.fillStyle = ball.color;
  ctx.fill();
};

export const calcSpeedForNextFrame = (
  ctx: CanvasRenderingContext2D,
  ball: BallType,
  collisionSpeedRate: number,
  perFrameSpeedRate: number
): BallType => {
  return {
    ...ball,
  };
};

export const prepareNextFrame = (
  ctx: CanvasRenderingContext2D,
  ball: BallType,
  collisionSpeedRate: number,
  perFrameSpeedRate: number
): BallType => {
  const newXSpeed = calcSpeed(
    ball.xSpeed,
    ball.x,
    ball.radius,
    ctx.canvas.width,
    perFrameSpeedRate,
    collisionSpeedRate
  );
  const newYSpeed = calcSpeed(
    ball.ySpeed,
    ball.y,
    ball.radius,
    ctx.canvas.height,
    perFrameSpeedRate,
    collisionSpeedRate
  );

  return {
    ...ball,
    xSpeed: newXSpeed,
    ySpeed: newYSpeed,
    x: calcPosition(newXSpeed, ball.x, ball.radius, ctx.canvas.width),
    y: calcPosition(newYSpeed, ball.y, ball.radius, ctx.canvas.height),
  };
};
