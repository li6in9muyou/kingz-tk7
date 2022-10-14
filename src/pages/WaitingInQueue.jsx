import { useContext, useEffect, useState } from "react";
import {
  evCloudDeclineMatch,
  evMatchIsMade,
  evStartLocalComputerGame,
  evStartMatching,
} from "../lib/Events.js";
import { EventBusContext } from "../lib/GlobalVariable.js";

function Waiting() {
  const eb = useContext(EventBusContext);
  return (
    <>
      <main className={"appContainer"}>
        <h1 className={"header"}>等待中</h1>
        <div
          className={"btn"}
          onClick={() => eb.publish(evStartLocalComputerGame())}
        >
          不等了，跟电脑玩
        </div>
        <div
          className={"btn debug"}
          onClick={() => eb.publish(evCloudDeclineMatch())}
        >
          服务器返回失败或者客户端决定不再等待
        </div>
        <div
          className={"btn debug"}
          onClick={() => eb.publish(evMatchIsMade())}
        >
          匹配成功
        </div>
      </main>
    </>
  );
}

function MatchFailed({ onContinueWaiting }) {
  const eb = useContext(EventBusContext);
  return (
    <>
      <h1>匹配失败</h1>
      <div onClick={onContinueWaiting}>继续等</div>
      <div onClick={() => eb.publish(evStartLocalComputerGame())}>跟电脑玩</div>
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
