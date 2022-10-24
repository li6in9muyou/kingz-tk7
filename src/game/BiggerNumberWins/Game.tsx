import { useContext, useState } from "react";
import { GameStateContext } from "../../pages/GamePage";
import { EventBusContext } from "../../lib/GlobalVariable";
import { evLocalMove } from "../../lib/Events";

export default function BiggerNumberWins() {
  const eb = useContext(EventBusContext);
  const state = useContext(GameStateContext) as {
    remote_moved: boolean;
    my_number: number;
  };
  const [number, setNumber] = useState(50);

  function handleLocalMove() {
    eb.publish(evLocalMove(number));
  }

  return (
    <>
      <div className="headline">
        pick your number{" "}
        {state.remote_moved
          ? "remote has picked a number"
          : "remote is picking"}
      </div>
      <input
        type="range"
        name=""
        id=""
        max={100}
        min={0}
        defaultValue={number}
        onChange={(ev) => setNumber(Number(ev.target.value))}
      />
      <div className="btn" onClick={handleLocalMove}>
        Go!
      </div>
    </>
  );
}
