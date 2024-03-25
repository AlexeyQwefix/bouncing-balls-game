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
        x: 350,
        y: 200,
        xSpeed: 10,
        ySpeed: -10,
        radius: 25,
        color: "#ff0000",
      }),
      new Ball({
        x: 700,
        y: 200,
        xSpeed: -10,
        ySpeed: 10,
        radius: 50,
        color: "#00ff00",
      }),
      new Ball({
        x: 600,
        y: 400,
        xSpeed: -10,
        ySpeed: -10,
        radius: 75,
        color: "#0000ff",
      }),
      new Ball({
        x: 170,
        y: 400,
        xSpeed: 10,
        ySpeed: 10,
        radius: 100,
        color: "#ffff00",
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
      lines.forEach((l) => l.draw(ctx));
      balls.forEach((b) => b.draw(ctx));
    }
    const timer = setInterval(drawFrame, 1000 / FPS);

    const clickHandler = (e: MouseEvent) => {
      e.preventDefault()
      const x = e.offsetX;
      const y = e.offsetY;
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

      const draggingBall = balls.find((b) => !!b.isDraggingTo);
      if (draggingBall) {
        draggingBall.setIsDraggingTo({ x, y });
        canvas.style.cursor = "none";
        return;
      }

      canvas.style.cursor = balls.some(
        (b) => (b.x - x) ** 2 + (b.y - y) ** 2 < b.radius ** 2
      )
        ? "pointer"
        : "default";
    };
    const mouseDown = (e: MouseEvent) => {
      if(e.button!==0)return
      e.preventDefault();
      const x = e.offsetX;
      const y = e.offsetY;
      balls.forEach((b) =>
        b.setIsDraggingTo(
          (b.x - x) ** 2 + (b.y - y) ** 2 < b.radius ** 2 ? { x, y } : null
        )
      );
    };
    const mouseUp = (e: MouseEvent) => {
      e.preventDefault();
      balls.forEach((b) => b.applySpeed());
      canvas.style.cursor = "default";
    };
    const mouseLeave = (e: MouseEvent) => {
      e.preventDefault();
      balls.forEach((b) => b.setIsDraggingTo(null));
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("contextmenu", clickHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mouseleave", mouseLeave);

    return () => {
      clearInterval(timer);
      canvas.removeEventListener("contextmenu", clickHandler);
      canvas.removeEventListener("mousemove", mouseMoveHandler);
      canvas.removeEventListener("mousedown", mouseDown);
      canvas.removeEventListener("mouseup", mouseUp);
      canvas.removeEventListener("mouseleave", mouseLeave);
    };
  }, [setSelectedBall]);

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
