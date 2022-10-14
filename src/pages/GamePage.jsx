import { useContext } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { evGameOver, evLocalQuit, evLocalSaveThenQuit } from "../lib/Events.js";
import { cssDebugBtn } from "../lib/DebugBtn.jsx";

function GamePage() {
  const eb = useContext(EventBusContext);
  return (
    <>
      <h1>此处显示一些信息</h1>
      <main>此处是棋盘</main>
      <button onClick={() => eb.publish(evLocalQuit())}>不玩了</button>
      <button onClick={() => eb.publish(evLocalSaveThenQuit())}>先退出</button>
      <button
        css={cssDebugBtn}
        onClick={() =>
          eb.publish(evGameOver(Math.random() > 0.5 ? "local" : "remote"))
        }
      >
        游戏正常结束
      </button>
    </>
  );
}

export default GamePage;
