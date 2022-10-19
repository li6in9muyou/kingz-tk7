import { useContext, useState } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";
import {
  evGameOver,
  evLocalQuit,
  evLocalSaveThenQuit,
  evRemotePlayerWentOffline,
} from "../lib/Events.js";
import { css } from "@emotion/react";
import Game from "../game/Game";

function InGame() {
  const eb = useContext(EventBusContext);
  return (
    <>
      <h1>此处显示一些信息</h1>
      <Game />
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

enum OnWhichPage {
  waiting_init_state,
  in_game,
  game_over,
}

function WaitingForInitGameState() {
  return <div className={"header"}>等待游戏的初始状态</div>;
}

function GamePage() {
  const [whicPage, setWhicPage] = useState(OnWhichPage.in_game);

  return (
    <>
      {whicPage === OnWhichPage.waiting_init_state && (
        <WaitingForInitGameState />
      )}
      {whicPage === OnWhichPage.in_game && <InGame />}
      {whicPage === OnWhichPage.game_over && <h1>游戏正常结束</h1>}
    </>
  );
}

export default GamePage;
