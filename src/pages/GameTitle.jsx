import { useContext, useState } from "react";
import { evMySavedGame, evStartNewGame } from "../lib/Events.js";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { css } from "@emotion/react";
import NameGen from "../lib/NameGen.js";
import ContentEditable from "react-contenteditable";
import { noop } from "lodash-es";

function Welcome() {
  return (
    <div
      css={css`
        font-size: 3rem;
        margin: 5px;
      `}
      className={"headline"}
    >
      欢迎，勇敢的小明
    </div>
  );
}

function AskLocalIdentity() {
  const [name, setName] = useState(NameGen());
  return (
    <div
      css={css`
        .input {
          display: block;
          width: 100%;
          font-size: 3rem;
          background: whitesmoke;
          color: black;
          padding: 5px 12px;
        }

        .label-container {
          display: flex;
          margin-top: 100px;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .nickname-container {
          padding: 25px;
        }
      `}
    >
      <div className={"nickname-container"}>
        <div className={"label-container"}>
          <label htmlFor="nickname" className={"headline"}>
            填入网名
          </label>
          <div className="btn" onClick={() => setName(NameGen())}>
            点击随机生成
          </div>
        </div>
        <ContentEditable
          css={css`
            display: block;
            width: 100%;
            font-size: 3rem;
            background: whitesmoke;
            color: black;
            padding: 5px 12px;
          `}
          html={name}
          onChange={noop}
        />
      </div>
    </div>
  );
}

function GameTitle() {
  const eb = useContext(EventBusContext);
  const noLocalIdentity = Math.random() > 0.5;

  return (
    <div
      css={css`
        h1 {
          font-size: 4rem;
        }
      `}
    >
      <main>
        <h1 className={"header"}>Kingz 游戏</h1>
        <section className={"appContainer"}>
          {noLocalIdentity && <AskLocalIdentity />}
          {!noLocalIdentity && <Welcome />}
          <div className={"btn"} onClick={() => eb.publish(evStartNewGame())}>
            开始新对局
          </div>
          <div className={"btn"} onClick={() => eb.publish(evMySavedGame())}>
            我的历史对局
          </div>
        </section>
      </main>
    </div>
  );
}

export default GameTitle;
