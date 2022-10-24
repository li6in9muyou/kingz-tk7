import "./main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import EventBus from "./lib/EventBus.js";
import { EventBusContext } from "./lib/GlobalVariable.js";
import { pgWaitingInQueue } from "./lib/PageSymbol";
import { Book } from "./lib/utility";

import RSPAdapter from "./game/RSP/RSPAdapter";
import { default as RSPGame } from "./game/RSP/Game";
import RegularPollingAdapter from "./game/OnlineAdapter";

if (import.meta.env.DEV) {
  import("./mocks/browser").then((module) => {
    module.default.start();
  });
  localStorage.setItem("debug", "*");
}

if (import.meta.env.DEV) {
  Book.load({
    player_id: "test_player_id",
    secret: "test_secret",
    nick_name: "test nick name",
    match_handle: "test_match_handle",
    page: pgWaitingInQueue,
  });
} else {
  Book.load();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EventBusContext.Provider value={EventBus}>
      <App
        GameView={RSPGame}
        OnlineAdapter={RegularPollingAdapter}
        GameAdapter={RSPAdapter}
      />
    </EventBusContext.Provider>
  </React.StrictMode>
);
