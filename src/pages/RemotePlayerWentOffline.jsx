import { evBackToGameTitle, evStartMatching } from "../lib/Events.js";
import { useContext } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";

function RemotePlayerWentOffline() {
  const eb = useContext(EventBusContext);
  return (
    <>
      <main className="appContainer">
        <h1 className={"header"}>你的对手离开了对局</h1>
        <div className={"btn"} onClick={() => eb.publish(evBackToGameTitle())}>
          我也不玩了
        </div>
        <div className={"btn"} onClick={() => eb.publish(evStartMatching())}>
          重新匹配
        </div>
      </main>
    </>
  );
}

export default RemotePlayerWentOffline;
