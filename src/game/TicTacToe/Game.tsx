import { useContext, useEffect, useState } from "react";
import { EventBusContext } from "../../lib/GlobalVariable";
import { evLocalMove, evUpdateGameState } from "../../lib/Events";
import { IGridGameState } from "./Adapter";
import { range } from "lodash-es";
import { css } from "@emotion/react";

function OneCell({ onClick, highlighted, symbol }) {
  return (
    <div
      css={css`
        user-select: none;
        aspect-ratio: 1;
        ${highlighted ? "outline: solid red 3px" : "outline: dashed red 1px"};
        margin: 10px;
        display: grid;
        place-content: center;
        font-size: 5rem;
        font-family: monospace;
        cursor: pointer;
        line-height: 1rem;
      `}
      onClick={onClick}
    >
      {symbol}
    </div>
  );
}

export default function TicTacToeView({
  state: initState,
}: {
  state: IGridGameState;
}) {
  const eb = useContext(EventBusContext);
  const [highlightedKey, setHighlightedKey] = useState("1-1");
  const [gameState, setGameState] = useState(initState);

  const pieces = new Map();
  for (const coord of gameState.response) {
    const [x, y] = coord;
    pieces.set(`${x}-${y}`, "o");
  }
  for (const coord of gameState.request) {
    const [x, y] = coord;
    pieces.set(`${x}-${y}`, "x");
  }

  function handleLocalMove() {
    const move = highlightedKey.split("-").map((x) => parseInt(x));
    eb.publish(evLocalMove(move));
  }

  useEffect(() => {
    eb.subscribe(evUpdateGameState(), (s) => {
      setGameState(s);
    });
  }, []);

  function handleClickCell(key) {
    setHighlightedKey(key);
  }

  console.log(pieces);
  return (
    <>
      <div className="headline">对局正在进行</div>
      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        `}
      >
        {range(3).map((row_id) =>
          range(3).map((col_id) => {
            const key = `${row_id}-${col_id}`;
            return (
              <OneCell
                key={key}
                onClick={() => handleClickCell(key)}
                symbol={pieces.get(key)}
                highlighted={highlightedKey === key}
              />
            );
          })
        )}
      </div>
      <div
        className="btn"
        onClick={handleLocalMove}
        css={css`
          margin: auto;
        `}
      >
        确定
      </div>
    </>
  );
}
