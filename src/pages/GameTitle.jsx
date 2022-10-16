import React, { useContext, useEffect, useState } from "react";
import { evMySavedGame, evStartNewGame } from "../lib/Events.js";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { css } from "@emotion/react";
import NameGen from "../lib/NameGen.js";
import ContentEditable from "react-contenteditable";
import { noop } from "lodash-es";
import fetch_local_identity, {
  get_local_nick_name,
  has_registered,
} from "../lib/LocalIdentity";
import { BarLoader } from "react-spinners";

function Welcome(props) {
  return (
    <div
      css={css`
        font-size: 3rem;
        margin: 5px;
      `}
      className={"headline"}
    >
      欢迎，{props.name}
    </div>
  );
}

function AskLocalIdentity(props) {
  const { name, setName } = props;
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

function PleaseWait() {
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

function GameTitle() {
  const eb = useContext(EventBusContext);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [show, setShow] = useState(false);
  const [name, setName] = useState(NameGen());

  useEffect(() => {
    const b = has_registered();
    setHasRegistered(b);
    if (b) {
      setName(get_local_nick_name());
    }
  }, []);

  function handleStartNewGame() {
    if (hasRegistered) {
      return eb.publish(evStartNewGame());
    }

    setShow(true);
    fetch_local_identity(name).then(() => {
      setShow(false);
      eb.publish(evStartNewGame());
    });
  }

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
          {!hasRegistered && <AskLocalIdentity name={name} setName={setName} />}
          {hasRegistered && <Welcome name={name} />}
          {show && <PleaseWait />}
          {!show && (
            <div className={"btn"} onClick={handleStartNewGame}>
              开始新对局
            </div>
          )}
          <div className={"btn"} onClick={() => eb.publish(evMySavedGame())}>
            我的历史对局
          </div>
        </section>
      </main>
    </div>
  );
}

export default GameTitle;
