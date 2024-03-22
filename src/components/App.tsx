import s from "./App.module.scss";
import BouncingArea from "./BouncingArea";

function App() {
  return (
    <div className={s.app}>
      <header className="App-header">
        <h1>
          Bouncing balls By Alexey{" "}
          <a href="https://github.com/AlexeyQwefix" target="blank">
            Github
          </a>
        </h1>
      </header>
      <BouncingArea></BouncingArea>
    </div>
  );
}

export default App;
