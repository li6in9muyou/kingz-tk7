import { useContext } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { evBackToGameTitle } from "../lib/Events.js";

function GameOver(props) {
  const eb = useContext(EventBusContext);
  return (
    <>
      <h1>游戏结束</h1>
      <p>{props.winner === "local" ? "你赢了" : "你输了"}</p>
      <button onClick={() => eb.publish(evBackToGameTitle())}>返回</button>
    </>
  );
}

export default GameOver;
