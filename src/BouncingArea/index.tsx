import s from "./style.module.scss";

const canvasWidth = 500;
const canvasHeight = 300;

function BouncingArea() {
  return (
    <canvas
      width={canvasWidth}
      height={canvasHeight}
      className={s.canvas}
    ></canvas>
  );
}

export default BouncingArea;
