import { useContext, useEffect, useState } from "react";
import { EventBusContext } from "../../lib/GlobalVariable";
import { evLocalMove, evUpdateGameState } from "../../lib/Events";

export default function BiggerNumberWins({
  state,
}: {
  state: { remote_moved: boolean; my_number: number };
}) {
  const eb = useContext(EventBusContext);
  const [number, setNumber] = useState(50);
  const [gameState, setGameState] = useState(state);

  function handleLocalMove() {
    eb.publish(evLocalMove(number));
  }

  useEffect(() => {
    eb.subscribe(evUpdateGameState(), (s) => {
      setGameState(s);
    });
  }, []);

  return (
    <>
      <div className="headline">
        {gameState.remote_moved === true
          ? "remote has picked a number"
          : "remote is picking"}
      </div>
      {gameState.my_number === null ? (
        <>
          <div className="headline">pick your number</div>
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
      ) : (
        <div className="headline">You picked {state.my_number}</div>
      )}
    </>
  );
}
