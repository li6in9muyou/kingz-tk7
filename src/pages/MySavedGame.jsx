import React, { useContext } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { evBackToGameTitle, evResumeSavedGame } from "../lib/Events.js";
import { PleaseWait } from "../components/PleaseWait";
import { isEmpty } from "lodash-es";

function MySavedGame({ savedGames }) {
  const eb = useContext(EventBusContext);
  function handleResumeGame(match_token) {
    eb.publish(evResumeSavedGame(match_token));
  }

  const show = isEmpty(savedGames);

  return (
    <>
      <h1 className={"header"}>此处显示各历史对局</h1>
      <main className="appContainer">
        <div
          className={"btn btn-warn"}
          onClick={() => eb.publish(evBackToGameTitle())}
        >
          返回主菜单
        </div>
        {show && <PleaseWait />}
        {savedGames.map((save) => {
          const { idx, match_token } = save;
          return (
            <div
              className={"btn"}
              key={idx}
              onClick={() => handleResumeGame(match_token)}
            >
              从残局{idx}开始玩
            </div>
          );
        })}
      </main>
    </>
  );
}

export default MySavedGame;
