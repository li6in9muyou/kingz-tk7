import React, { useContext, useEffect, useState } from "react";
import { evMySavedGame, evRegister, evStartNewGame } from "../lib/Events.js";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { css } from "@emotion/react";
import NameGen from "../lib/NameGen.js";
import ContentEditable from "react-contenteditable";
import { get_local_nick_name } from "../lib/LocalIdentity";
import { PleaseWait } from "../components/PleaseWait.jsx";

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

  function handleChange(ev) {
    setName(ev.target.value);
  }

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
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

function GameTitle(props) {
  const { hasRegistered } = props;

  const eb = useContext(EventBusContext);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (hasRegistered) {
      setName(get_local_nick_name());
    } else {
      setName(NameGen());
    }
  }, [hasRegistered]);

  function handleStartNewGame() {
    setShow(true);
    if (hasRegistered) {
      return eb.publish(evStartNewGame());
    } else {
      eb.publish(evRegister(name));
      eb.publish(evStartNewGame());
    }
  }

  function handleGotoMySavedGame() {
    if (hasRegistered) {
      eb.publish(evStartNewGame());
    } else {
      eb.publish(evRegister(name));
    }
    return eb.publish(evMySavedGame());
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
          <div className={"btn"} onClick={handleGotoMySavedGame}>
            我的历史对局
          </div>
        </section>
      </main>
    </div>
  );
}

export default GameTitle;
