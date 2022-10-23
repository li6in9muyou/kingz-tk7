import GameTitle from "./pages/GameTitle.jsx";
import { useContext, useEffect, useState } from "react";
import {
  pgChooseOpponentType,
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
  evLocalQuit,
  evLocalSaveThenQuit,
  evMatchIsMade,
  evStartPollingMatchStatus,
  evRegister,
  evCancelMatching,
  evPushLocalGameStateToCloud,
  evCloudSendEvent,
  evGameOver,
} from "./lib/Events.js";
import debug from "debug";
import GamePage from "./pages/GamePage";
import WaitingInQueue from "./pages/WaitingInQueue.jsx";
import MySavedGame from "./pages/MySavedGame.jsx";
import RemotePlayerWentOffline from "./pages/RemotePlayerWentOffline.jsx";
import { cancel_match, poll } from "./lib/MatchMaker";
import fetch_local_identity, { has_registered } from "./lib/LocalIdentity";
import fetchSavedGames from "./lib/FetchSavedGames.js";
import RSPAdapter from "./game/RSPAdapter";
import { default as OnlineAdapter } from "./game/OnlineAdapter";
import { Book } from "./lib/utility";
import { MatchMakingTrace as mmt } from "./loggers.js";
const note = debug("App.jsx");

function App(props) {
  const [page, setPage] = useState(props.page ?? pgGameTitle);
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
    mmt("App subscribe evStartPollingMatchStatus()");
    eb.subscribe(evStartPollingMatchStatus(), () => {
      poll(eb);
    });
    mmt("App subscribe evMatchIsMade()");
    eb.subscribe(evMatchIsMade(), () => {
      mmt("received evMatchIsMade()");
      setPage(pgGamePage);
      mmt("setPage(pgGamePage)");
      setTimeout(() => {
        const onlineAdapter = new OnlineAdapter(
          Book.match_handle,
          Book.player_id
        );
        eb.subscribe(
          evPushLocalGameStateToCloud(),
          onlineAdapter.push_state_to_cloud.bind(onlineAdapter)
        );
        const play = new RSPAdapter(eb, {});
        onlineAdapter.attach_event_bus(eb);
        eb.subscribe(evCloudSendEvent(), (game_state) => {
          play.mergeCloudState(game_state);
        });
        const close_polling = () => onlineAdapter.close();
        eb.subscribe(evLocalQuit(), close_polling);
        eb.subscribe(evLocalSaveThenQuit(), close_polling);
        eb.subscribe(evGameOver(), close_polling);
        mmt("bind: evPushLocalGameStateToCloud -> push_state_to_cloud");
        mmt("bind: onlineAdapter -> mergeCloudState");
      }, 100);
    });
    mmt("App subscribe evStartMatching()");
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
      </NavBar>
    </>
  );
}

export default App;
