import { useContext, useEffect, useState } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";
import {
  evBackToGameTitle,
  evGameOver,
  evInitGameState,
  evLocalQuit,
  evLocalSaveThenQuit,
  evRemotePlayerWentOffline,
} from "../lib/Events.js";
import { css } from "@emotion/react";
import Game from "../game/Game";

enum OnWhichPage {
  waiting_init_state,
  in_game,
  game_over,
}

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

function WaitingForInitGameState() {
  return <div className={"header"}>等待游戏的初始状态</div>;
}

function GameOver({ winner }) {
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
          {winner === "local" ? "你赢了" : "你输了"}
        </h1>
        <div className={"btn"} onClick={() => eb.publish(evBackToGameTitle())}>
          返回
        </div>
      </main>
    </>
  );
}

function GamePage() {
  const [whichPage, setWhichPage] = useState(OnWhichPage.waiting_init_state);
  const [winner, setWinner] = useState(null);
  const eb = useContext(EventBusContext);

  useEffect(() => {
    eb.subscribe(evGameOver(), (winner) => {
      setWinner(winner);
      setWhichPage(OnWhichPage.game_over);
    });
    eb.subscribe(evInitGameState(), () => {
      setWhichPage(OnWhichPage.in_game);
    });
  }, []);

  return (
    <>
      {whichPage === OnWhichPage.waiting_init_state && (
        <WaitingForInitGameState />
      )}
      {whichPage === OnWhichPage.in_game && <InGame />}
      {whichPage === OnWhichPage.game_over && <GameOver winner={winner} />}
    </>
  );
}

export default GamePage;
