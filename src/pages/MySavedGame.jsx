import React, { useContext } from "react";
import { range } from "lodash-es";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { evBackToGameTitle, evResumeSavedGame } from "../lib/Events.js";

function MySavedGame() {
  const eb = useContext(EventBusContext);
  function handleResumeGame(game_index) {
    eb.publish(evResumeSavedGame(game_index));
  }
  return (
    <>
      <h1>此处显示各历史对局</h1>
      <button onClick={() => eb.publish(evBackToGameTitle())}>
        返回主菜单
      </button>
      {range(1, 6).map((idx) => (
        <button key={idx} onClick={() => handleResumeGame(idx)}>
          从残局{idx}开始玩
        </button>
      ))}
    </>
  );
}

export default MySavedGame;
