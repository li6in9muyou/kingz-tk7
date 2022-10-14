import GameTitle from "./pages/GameTitle.jsx";
import { useContext, useEffect, useState } from "react";
import {
  pgChooseOpponentType,
  pgGamePage,
  pgGameTitle,
  pgMySavedGame,
  pgWaitingInQueue,
} from "./lib/PageSymbol.js";
import ChooseOpponentType from "./pages/ChooseOpponentType.jsx";
import { NavBar } from "./components/NavBar.jsx";
import { EventBusContext } from "./lib/GlobalVariable.js";
import {
  evStartLocalComputerGame,
  evMySavedGame,
  evStartMatching,
  evStartNewGame,
  evResumeSavedGame,
} from "./lib/Events.js";
import debug from "debug";
import GamePage from "./pages/GamePage.jsx";
import WaitingInQueue from "./pages/WaitingInQueue.jsx";
import MySavedGame from "./pages/MySavedGame.jsx";

const note = debug("App.jsx");

function App() {
  const [page, setPage] = useState(pgGameTitle);
  const eb = useContext(EventBusContext);
  useEffect(() => {
    eb.subscribe(evStartNewGame(), () => {
      setPage(pgChooseOpponentType);
    });
    eb.subscribe(evResumeSavedGame(), () => {
      setPage(pgChooseOpponentType);
    });
    eb.subscribe(evStartMatching(), () => {
      setPage(pgWaitingInQueue);
    });
    eb.subscribe(evStartLocalComputerGame(), () => {
      setPage(pgGamePage);
    });
    eb.subscribe(evMySavedGame(), () => {
      setPage(pgMySavedGame);
    });
    note("set up subscribers");
  }, []);

  return (
    <>
      <NavBar>
        {page === pgGameTitle && <GameTitle />}
        {page === pgMySavedGame && <MySavedGame />}
        {page === pgChooseOpponentType && <ChooseOpponentType />}
        {page === pgGamePage && <GamePage />}
        {page === pgWaitingInQueue && <WaitingInQueue />}
      </NavBar>
    </>
  );
}

export default App;
