import { evBackToGameTitle, evStartMatching } from "../lib/Events.js";
import { useContext } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";

function RemotePlayerWentOffline() {
  const eb = useContext(EventBusContext);
  return (
    <>
      <h1>你的对手离开了对局</h1>
      <button onClick={() => eb.publish(evBackToGameTitle())}>
        我也不玩了
      </button>
      <button onClick={() => eb.publish(evStartMatching())}>重新匹配</button>
    </>
  );
}

export default RemotePlayerWentOffline;
