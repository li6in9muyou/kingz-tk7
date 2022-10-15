import React, { useContext, useEffect, useState } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { evBackToGameTitle, evResumeSavedGame } from "../lib/Events.js";
import axios from "axios";
import { BarLoader } from "react-spinners";
import { sleep } from "../lib/utility";
import { css } from "@emotion/react";

async function fetchSavedGames() {
  for (let i = 0; i < 3; i++) {
    try {
      return (await axios.get("/saved_games/pABCDABCDABCD")).data;
    } catch (e) {
      await sleep(300);
    }
  }
  return [];
}

function MySavedGame() {
  const eb = useContext(EventBusContext);
  function handleResumeGame(match_token) {
    eb.publish(evResumeSavedGame(match_token));
  }
  const [savedGames, setSavedGames] = useState([]);
  const [show, setSpinner] = useState(true);
  const turnOffSpinner = () => setSpinner(false);

  useEffect(() => {
    fetchSavedGames().then((r) => {
      turnOffSpinner();
      setSavedGames(r);
    });
  }, []);

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
        {show && (
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: 10px;
            `}
          >
            <span>加载中</span>
            <BarLoader color={"#FFFFFF"} />
          </div>
        )}
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
