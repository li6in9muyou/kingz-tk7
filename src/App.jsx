import GameTitle from "./pages/GameTitle.jsx";
import { useContext, useEffect, useState } from "react";
import {
  pgChooseOpponentType,
  pgGameOver,
  pgGamePage,
  pgGameTitle,
  pgMySavedGame,
  pgRemotePlayerWentOffline,
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
  evBackToGameTitle,
  evRemotePlayerWentOffline,
  evGameOver,
  evLocalQuit,
  evLocalSaveThenQuit,
  evMatchIsMade,
  evStartPollingMatchStatus,
  evRegister,
  evCancelMatching,
} from "./lib/Events.js";
import debug from "debug";
import GamePage from "./pages/GamePage.jsx";
import WaitingInQueue from "./pages/WaitingInQueue.jsx";
import MySavedGame from "./pages/MySavedGame.jsx";
import RemotePlayerWentOffline from "./pages/RemotePlayerWentOffline.jsx";
import GameOver from "./pages/GameOver.jsx";
import { cancel_match, poll } from "./lib/MatchMaker";
import fetch_local_identity, { has_registered } from "./lib/LocalIdentity";
import fetchSavedGames from "./lib/FetchSavedGames.js";

const note = debug("App.jsx");

function App() {
  const [page, setPage] = useState(pgGameTitle);
  const [savedGames, setSavedGames] = useState([]);
  const eb = useContext(EventBusContext);
  useEffect(() => {
    eb.subscribe(evCancelMatching(), () => {
      cancel_match();
    });
    eb.subscribe(evRegister(), (name) => {
      fetch_local_identity(name);
    });
    eb.subscribe(evStartNewGame(), () => {
      setPage(pgChooseOpponentType);
    });
    eb.subscribe(evResumeSavedGame(), () => {
      setPage(pgChooseOpponentType);
    });
    eb.subscribe(evStartPollingMatchStatus(), () => {
      poll(eb);
    });
    eb.subscribe(evMatchIsMade(), () => {
      setPage(pgGamePage);
    });
    eb.subscribe(evStartMatching(), () => {
      setPage(pgWaitingInQueue);
    });
    eb.subscribe(evStartLocalComputerGame(), () => {
      setPage(pgGamePage);
    });
    eb.subscribe(evMySavedGame(), () => {
      fetchSavedGames().then((r) => {
        setSavedGames(r);
      });
      setPage(pgMySavedGame);
    });
    eb.subscribe(evBackToGameTitle(), () => {
      setPage(pgGameTitle);
    });
    eb.subscribe(evRemotePlayerWentOffline(), () => {
      setPage(pgRemotePlayerWentOffline);
    });
    eb.subscribe(evGameOver(), () => {
      setPage(pgGameOver);
    });
    eb.subscribe(evLocalQuit(), () => {
      setPage(pgGameTitle);
    });
    eb.subscribe(evLocalSaveThenQuit(), () => {
      setPage(pgGameTitle);
    });
    note("set up subscribers");
  }, []);

  return (
    <>
      <NavBar>
        {page === pgGameTitle && <GameTitle hasRegistered={has_registered()} />}
        {page === pgMySavedGame && <MySavedGame savedGames={savedGames} />}
        {page === pgChooseOpponentType && <ChooseOpponentType />}
        {page === pgGamePage && <GamePage />}
        {page === pgWaitingInQueue && <WaitingInQueue />}
        {page === pgRemotePlayerWentOffline && <RemotePlayerWentOffline />}
        {page === pgGameOver && <GameOver />}
      </NavBar>
    </>
  );
}

export default App;
