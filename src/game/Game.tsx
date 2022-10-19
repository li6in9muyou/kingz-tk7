import { css } from "@emotion/react";

function Game() {
  return (
    <main
      css={css`
        margin: 20px;
        aspect-ratio: 1;
        outline: red 5px solid;
      `}
    >
      此处是棋盘
    </main>
  );
}

export default Game;
