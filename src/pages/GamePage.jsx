import { useContext } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";
import {
  evGameOver,
  evLocalQuit,
  evLocalSaveThenQuit,
  evRemotePlayerWentOffline,
} from "../lib/Events.js";
import { css } from "@emotion/react";

function GamePage() {
  const eb = useContext(EventBusContext);
  return (
    <>
      <h1>此处显示一些信息</h1>
      <main
        css={css`
          margin: 20px;
          aspect-ratio: 1;
          outline: red 5px solid;
        `}
      >
        此处是棋盘
      </main>
      <main className="appContainer">
        <div
          css={css`
            display: flex;
          `}
        >
          <div className={"btn"} onClick={() => eb.publish(evLocalQuit())}>
            不玩了
          </div>
          <div
            className={"btn"}
            onClick={() => eb.publish(evLocalSaveThenQuit())}
          >
            先退出
          </div>
        </div>
        <div
          className={"btn debug"}
          onClick={() =>
            eb.publish(evGameOver(Math.random() > 0.5 ? "local" : "remote"))
          }
        >
          游戏正常结束
        </div>
        <div
          className={"btn debug"}
          onClick={() => eb.publish(evRemotePlayerWentOffline())}
        >
          远端玩家因故离线
        </div>
      </main>
    </>
  );
}

export default GamePage;
