import { useEffect, useRef } from "react";
import s from "./style.module.scss";
import { Ball, clear, drawBall, resolveCollisions } from "../../ballLogic/ballLogic";
import { Line } from "../../ballLogic/lines";

const canvasWidth = 800;
const canvasHeight = 600;

function BouncingArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let balls: Ball[] = [
      new Ball({
        x: 100,
        y: 120,
        xSpeed: 1,
        ySpeed: 1,
        radius: 20,
        color: "yellow",
      }),
      new Ball({
        x: 50,
        y: 50,
        xSpeed: 1,
        ySpeed: 1,
        radius: 30,
        color: "green",
      }),
    ];
    console.log(balls)

    const lines: Line[] = [];
    lines.push(new Line(-10, 10, ctx.canvas.width + 10, 10));
    lines.push((new Line(-10, ctx.canvas.height - 10, ctx.canvas.width + 10, ctx.canvas.height - 10)).reverse());
    lines.push((new Line(10, -10, 10, ctx.canvas.height + 10)).reverse());
    lines.push(new Line(ctx.canvas.width - 10, -10, ctx.canvas.width - 10, ctx.canvas.height + 10));
    mainLoop();
    function mainLoop() {
      // console.warn('mainLoop')
      if (!ctx) return;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      resolveCollisions(balls,lines);
      for (const b of balls) {
        b.update();
      }
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      for (const b of balls) {
        b.draw(ctx);
      }
      for (const l of lines) {
        l.draw(ctx);
      }
      ctx.stroke();
      requestAnimationFrame(mainLoop);
    }
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
