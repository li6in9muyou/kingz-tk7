import { evStartLocalComputerGame, evStartMatching } from "../lib/Events.js";
import { useContext } from "react";
import { EventBusContext } from "../lib/GlobalVariable.js";

function ChooseOpponentType() {
  const eb = useContext(EventBusContext);
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
        <div className={"btn"} onClick={() => eb.publish(evStartMatching())}>
          匹配玩家
        </div>
      </main>
    </>
  );
}

export default ChooseOpponentType;
