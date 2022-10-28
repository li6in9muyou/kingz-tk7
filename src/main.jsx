import "./main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import EventBus from "./lib/EventBus.js";
import { EventBusContext } from "./lib/GlobalVariable.js";
import { pgGameTitle } from "./lib/PageSymbol";
import { Book } from "./lib/utility";

import GameAdapter from "./game/TicTacToe/Adapter";
import { default as GameView } from "./game/TicTacToe/Game";
import { default as MockCloud } from "./game/TicTacToe/mock_server";

import RegularPollingAdapter from "./lib/OnlineAdapter";
import axios from "axios";

if (import.meta.env.DEV) {
  localStorage.setItem("debug", "*");
}

if (import.meta.env.MODE === "dev_mock") {
  import("./mocks/generic_server").then((module) => {
    module.default(new MockCloud()).start();
  });
  console.info("using mock service worker");
}

const baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = baseURL;
console.info("using backend at", baseURL);

if (import.meta.env.DEV) {
  Book.load({
    player_id: "test_player_id",
    secret: "test_secret",
    nick_name: "test nick name",
    match_handle: "test_match_handle",
    page: pgGameTitle,
  });
} else {
  Book.load();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EventBusContext.Provider value={EventBus}>
      <App
        GameView={GameView}
        OnlineAdapter={RegularPollingAdapter}
        GameAdapter={new GameAdapter()}
      />
    </EventBusContext.Provider>
  </React.StrictMode>
);
