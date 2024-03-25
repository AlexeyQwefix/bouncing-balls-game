import { useEffect, useRef } from "react";
import s from "./style.module.scss";
import { Ball, resolveCollisions } from "../../ballLogic/ballLogic";
import { Line } from "../../ballLogic/lines";

const canvasWidth = 800;
const canvasHeight = 600;
const FPS = 60;

function BouncingArea({
  setSelectedBall,
}: {
  setSelectedBall: (b: Ball | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let balls: Ball[] = [
      new Ball({
        x: 250,
        y: 300,
        xSpeed: 3,
        ySpeed: 1,
        radius: 200,
        color: "yellow",
      }),
      new Ball({
        x: 600,
        y: 400,
        xSpeed: 0,
        ySpeed: 0,
        radius: 30,
        color: "red",
      }),
    ];
    const lines: Line[] = [
      new Line(0, 0, canvasWidth, 0), //top
      new Line(0, canvasHeight, canvasWidth, canvasHeight).reverse(), //bot
      new Line(0, 0, 0, canvasHeight).reverse(), //left
      new Line(canvasWidth, 0, canvasWidth, canvasHeight), //right
    ];

    function drawFrame() {
      if (!ctx) return;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      resolveCollisions(balls, lines);
      balls.forEach((b) => b.update());
      balls.forEach((b) => b.draw(ctx));
      lines.forEach((l) => l.draw(ctx));
    }
    const timer = setInterval(drawFrame, 1000 / FPS);

    const clickHandler = (e: MouseEvent) => {
      const x = e.offsetX;
      const y = e.offsetY;
      // find circle under click
      const ball = balls.find(
        (b) => (b.x - x) ** 2 + (b.y - y) ** 2 < b.radius ** 2
      );
      setSelectedBall(ball || null);
      balls.forEach((b) => b.setSelected(false));
      if (ball) ball.setSelected(true);
    };
    const mouseMoveHandler = (e: MouseEvent) => {
      const x = e.offsetX;
      const y = e.offsetY;
      canvas.style.cursor = balls.some(
        (b) => (b.x - x) ** 2 + (b.y - y) ** 2 < b.radius ** 2
      )
        ? "pointer"
        : "default";
    };

    canvas.addEventListener("click", clickHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      clearInterval(timer);
      canvas.removeEventListener("click", clickHandler);
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    };
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
