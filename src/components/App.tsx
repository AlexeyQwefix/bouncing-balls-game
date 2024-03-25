import { useState } from "react";
import s from "./App.module.scss";
import BouncingArea from "./BouncingArea";
import { Ball } from "../ballLogic/ballLogic";
import BallSettings from "./BallSettings";

function App() {
  const [selectedBall, setSelectedBall] = useState<Ball | null>(null);
  return (
    <div className={s.app}>
      <header className="App-header">
        <h1>
          Bouncing balls By Alexey{" "}
          <a href="https://github.com/AlexeyQwefix" target="blank">
            Github
          </a>
        </h1>
        <h2>Left click to apply speed, right click to pick ball</h2>
      </header>
      <BouncingArea setSelectedBall={setSelectedBall}></BouncingArea>
      {selectedBall && (
        <BallSettings selectedBall={selectedBall}></BallSettings>
      )}
    </div>
  );
}

export default App;
