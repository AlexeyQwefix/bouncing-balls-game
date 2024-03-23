import { useEffect, useRef } from "react";
import s from "./style.module.scss";
import { BallType } from "../../types/BallType";
import { clear, drawBall, prepareNextFrame } from "../../ballLogic/ballLogic";

const canvasWidth = 800;
const canvasHeight = 600;
const FPS = 60;
const collisionSpeedRate = 0.9;
const perFrameSpeedRate = 0.99;

function BouncingArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let balls: BallType[] = [
      {
        x: 100,
        y: 120,
        xSpeed: -10,
        ySpeed: 10,
        radius: 20,
        color: "yellow",
      },
      {
        x: 50,
        y: 100,
        xSpeed: 20,
        ySpeed: 30,
        radius: 30,
        color: "green",
      },
    ];
    const stopCB =  () => clearInterval(interval)
    const interval = setInterval(() => {
      clear(ctx);
      balls.forEach((ball) => drawBall(ctx, ball));
      
      balls = balls.map((ball) =>
        prepareNextFrame(ctx, ball, collisionSpeedRate, perFrameSpeedRate)
      );
      
    }, 1000 / FPS);
    return stopCB
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className={s.canvas}
    ></canvas>
  );
}

export default BouncingArea;
