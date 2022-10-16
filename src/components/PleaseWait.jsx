import { css } from "@emotion/react";
import { BarLoader } from "react-spinners";
import React from "react";

export function PleaseWait() {
  return (
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
  );
}
