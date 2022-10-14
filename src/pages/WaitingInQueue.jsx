import { useContext, useEffect, useState } from "react";
import {
  evCloudDeclineMatch,
  evStartLocalComputerGame,
  evStartMatching,
} from "../lib/Events.js";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { cssDebugBtn } from "../lib/DebugBtn.jsx";

function Waiting() {
  const eb = useContext(EventBusContext);
  return (
    <>
      <h1>等待中</h1>
      <button onClick={() => eb.publish(evStartLocalComputerGame())}>
        不等了，跟电脑玩
      </button>
      <button
        css={cssDebugBtn}
        onClick={() => eb.publish(evCloudDeclineMatch())}
      >
        服务器返回失败或者客户端决定不再等待
      </button>
    </>
  );
}

function MatchFailed({ onContinueWaiting }) {
  const eb = useContext(EventBusContext);
  return (
    <>
      <h1>匹配失败</h1>
      <button onClick={onContinueWaiting}>继续等</button>
      <button onClick={() => eb.publish(evStartLocalComputerGame())}>
        跟电脑玩
      </button>
    </>
  );
}

function WaitingInQueue() {
  const [showingFailed, setShowingFailed] = useState(false);
  const eb = useContext(EventBusContext);
  useEffect(() => {
    eb.subscribe(evCloudDeclineMatch(), () => {
      setShowingFailed(true);
    });
  }, []);

  function handleRetry() {
    eb.publish(evStartMatching());
    setShowingFailed(false);
  }
  return (
    <>
      {showingFailed && <MatchFailed onContinueWaiting={handleRetry} />}
      {!showingFailed && <Waiting />}
    </>
  );
}

export default WaitingInQueue;
