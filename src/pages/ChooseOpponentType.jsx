import { evStartLocalComputerGame, evStartMatching } from "../lib/Events.js";
import { useContext, useState } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";
import { PleaseWait } from "../components/PleaseWait.jsx";
import { try_match } from "../lib/GameHttpClient";

function ChooseOpponentType() {
  const eb = useContext(EventBusContext);
  const [loading, setLoading] = useState(false);

  function handleStartMatching() {
    setLoading(true);
    try_match().then(() => {
      eb.publish(evStartMatching());
    });
  }

  return (
    <>
      <main className="appContainer">
        <h1 className={"header"}>跟电脑玩或者匹配玩家</h1>
        <div
          className={"btn"}
          onClick={() => eb.publish(evStartLocalComputerGame())}
        >
          和电脑
        </div>
        {loading && <PleaseWait />}
        {!loading && (
          <div className={"btn"} onClick={handleStartMatching}>
            匹配玩家
          </div>
        )}
      </main>
    </>
  );
}

export default ChooseOpponentType;
