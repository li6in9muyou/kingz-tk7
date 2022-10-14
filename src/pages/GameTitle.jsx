import { useContext } from "react";
import { evMySavedGame, evStartNewGame } from "../lib/Events.js";
import { EventBusContext } from "../lib/GlobalVariable.js";

function GameTitle() {
  const eb = useContext(EventBusContext);
  return (
    <>
      <div>Kingz 游戏</div>
      <div className="card">
        <button
          id="counter"
          type="button"
          onClick={() => eb.publish(evStartNewGame())}
        >
          开始新对局
        </button>
        <button
          id="counter"
          type="button"
          onClick={() => eb.publish(evMySavedGame())}
        >
          我的历史对局
        </button>
      </div>
    </>
  );
}

export default GameTitle;
