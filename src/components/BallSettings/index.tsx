import { useState } from "react";
import { Ball } from "../../ballLogic/ballLogic";
import s from "./style.module.scss";

function BallSettings({ selectedBall }: { selectedBall: Ball }) {
  const [ballColor, setBallColor] = useState(selectedBall.color);
  return (
    <div className={s.wrapper}>
      <label className={s.preview} style={{ background: selectedBall.color }}>
        <input
          className={s.colorPicker}
          type="color"
          value={ballColor}
          onChange={(e) => setBallColor(selectedBall.setColor(e.target.value))}
        />
      </label>
    </div>
  );
}

export default BallSettings;
