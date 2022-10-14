import { evStartLocalComputerGame, evStartMatching } from "../lib/Events.js";
import { useContext } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";

function ChooseOpponentType() {
  const eb = useContext(EventBusContext);
  return (
    <>
      <h1>跟电脑玩或者匹配玩家</h1>
      <button onClick={() => eb.publish(evStartLocalComputerGame())}>
        和电脑
      </button>
      <button onClick={() => eb.publish(evStartMatching())}>匹配玩家</button>
    </>
  );
}

export default ChooseOpponentType;
