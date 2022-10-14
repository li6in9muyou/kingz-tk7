import { css } from "@emotion/react";

export function NavBar(props) {
  return (
    <>
      <h1
        css={css`
          background-color: hotpink;
          position: fixed;
          width: 100%;
          bottom: 0;
        `}
      >
        导航栏
      </h1>
      {props.children}
    </>
  );
}
