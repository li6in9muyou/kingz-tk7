import { useContext } from "react";
import { evMySavedGame, evStartNewGame } from "../lib/Events.js";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { css } from "@emotion/react";

function GameTitle() {
  const eb = useContext(EventBusContext);
  return (
    <div
      css={css`
        main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: black;
          height: 100vh;
          width: 100vw;
        }

        section {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        h1 {
          font-size: 4rem;
        }
      `}
    >
      <main>
        <h1 className={"header"}>Kingz 游戏</h1>
        <section className={"appContainer"}>
          <div className={"btn"} onClick={() => eb.publish(evStartNewGame())}>
            开始新对局
          </div>
          <div className={"btn"} onClick={() => eb.publish(evMySavedGame())}>
            我的历史对局
          </div>
        </section>
      </main>
    </div>
  );
}

export default GameTitle;
