import { useContext, useEffect, useState } from "react";
import {
  evCancelMatching,
  evCloudDeclineMatch,
  evMatchIsMade,
  evStartLocalComputerGame,
  evStartMatching,
  evStartPollingMatchStatus,
} from "../lib/Events.js";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { cancel_match } from "../lib/MatchMaker";
import { PleaseWait } from "../components/PleaseWait.jsx";
import { MatchMakingTrace as mmt } from "../loggers";

function Waiting() {
  const eb = useContext(EventBusContext);
  const [loading, setLoading] = useState(false);

  function onCloudDeclineMatch() {
    mmt("user cancel match");
    eb.publish(evCloudDeclineMatch());
  }

  function handleCancelMatching() {
    setLoading(true);
    mmt("user cancel match");
    cancel_match().then(() => {
      setLoading(false);
      mmt("eb.publish(evStartLocalComputerGame())");
      eb.publish(evStartLocalComputerGame());
    });
  }

  useEffect(() => {
    mmt("eb.publish(evStartPollingMatchStatus())");
    eb.publish(evStartPollingMatchStatus());
  }, []);

  return (
    <>
      <main className={"appContainer"}>
        <h1 className={"header"}>等待中</h1>
        {loading && <PleaseWait />}
        {!loading && (
          <div className={"btn"} onClick={handleCancelMatching}>
            不等了，跟电脑玩
          </div>
        )}
        {import.meta.env.DEV && (
          <>
            <div className={"btn debug"} onClick={onCloudDeclineMatch}>
              服务器返回失败或者客户端决定不再等待
            </div>
            <div
              className={"btn debug"}
              onClick={() => eb.publish(evMatchIsMade())}
            >
              匹配成功
            </div>
          </>
        )}
      </main>
    </>
  );
}

function MatchFailed({ onContinueWaiting }) {
  const eb = useContext(EventBusContext);
  return (
    <main className={"appContainer"}>
      <h1 className={"header"}>匹配失败</h1>
      <div className={"btn"} onClick={onContinueWaiting}>
        继续等
      </div>
      <div className={"btn"} onClick={handleCancelMatching}>
        跟电脑玩
      </div>
    </main>
  );

  function handleCancelMatching() {
    eb.publish(evCancelMatching());
    eb.publish(evStartLocalComputerGame());
  }
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
