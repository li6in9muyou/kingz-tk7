import { css } from "@emotion/react";
import { ChangeEvent, useContext, useState } from "react";
import { Book } from "../../lib/utility";
import { EventBusContext } from "../../lib/GlobalVariable";
import { evLocalMove } from "../../lib/Events.js";
import { join } from "lodash-es";
import { GameStateContext } from "../../pages/GamePage";

const to_human_readable = (ch) => ({ p: "paper", s: "scissor", r: "rock" }[ch]);

function Game() {
  const eb = useContext(EventBusContext);
  const state = useContext(GameStateContext) as {
    response: string[];
    request: string[];
    result: string[];
  };
  const [cmd, setCmd] = useState("s");

  function handleLocalMove() {
    eb.publish(evLocalMove(cmd));
  }

  return (
    <main
      // @ts-ignore
      css={css`
        margin: 20px;
        aspect-ratio: 1;
        outline: red 5px solid;
        font-size: 25px;
      `}
    >
      <p>Game started, pick your move:</p>
      <p>Played as {Book.nick_name}</p>
      <p>Previous moves: {join(state.response.map(to_human_readable), ", ")}</p>
      <p>Previous results: {join(state.result, ", ")}</p>
      <p>
        Opponent moves:
        {join(
          state.request.slice(0, state.response.length).map(to_human_readable),
          ", "
        )}
      </p>
      <div
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCmd(e.target.value)}
      >
        <input
          type="radio"
          id="move-s"
          name="move"
          value="s"
          defaultChecked={cmd === "s"}
        />
        <label htmlFor="move-s">scissor</label>
        <input
          type="radio"
          id="move-r"
          name="move"
          value="r"
          defaultChecked={cmd === "r"}
        />
        <label htmlFor="move-r">rock</label>
        <input
          type="radio"
          id="move-p"
          name="move"
          value="p"
          defaultChecked={cmd === "p"}
        />
        <label htmlFor="move-p">paper</label>
      </div>
      <div className={"btn"} id="move_submit" onClick={handleLocalMove}>
        battle!
      </div>
    </main>
  );
}

export default Game;
