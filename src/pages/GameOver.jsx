import { useContext } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { evBackToGameTitle } from "../lib/Events.js";
import { css } from "@emotion/react";

function GameOver(props) {
  const eb = useContext(EventBusContext);
  return (
    <>
      <main className="appContainer">
        <h1>游戏结束</h1>
        <h1
          className={"floating headline"}
          css={css`
            font-size: 5rem;
          `}
        >
          {props.winner === "local" ? "你赢了" : "你输了"}
        </h1>
        <div className={"btn"} onClick={() => eb.publish(evBackToGameTitle())}>
          返回
        </div>
      </main>
    </>
  );
}

export default GameOver;
