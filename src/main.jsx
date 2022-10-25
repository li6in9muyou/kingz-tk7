import "./main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import EventBus from "./lib/EventBus.js";
import { EventBusContext } from "./lib/GlobalVariable.js";
import { pgWaitingInQueue } from "./lib/PageSymbol";
import { Book } from "./lib/utility";

import GameAdapter from "./game/BiggerNumberWins/BNWAdapter";
import { default as GameView } from "./game/BiggerNumberWins/Game";
import BiggerNumberWinsGameCloud from "./game/BiggerNumberWins/mock_server";

import RegularPollingAdapter from "./game/OnlineAdapter";
import axios from "axios";
import { isEmpty } from "lodash-es";

if (import.meta.env.DEV) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  localStorage.setItem("debug", "*");

  if (import.meta.env.MODE === "dev_java_backend") {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    if (isEmpty(baseURL)) {
      throw "env VITE_API_BASE_URL is not set!";
    }
    console.info("using java backend at", baseURL);
  }
  if (import.meta.env.MODE === "dev_mock") {
    import("./mocks/generic_server").then((module) => {
      module.default(new BiggerNumberWinsGameCloud()).start();
    });
    console.info("using mock service worker");
  }
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
        GameView={GameView}
        OnlineAdapter={RegularPollingAdapter}
        GameAdapter={GameAdapter}
      />
    </EventBusContext.Provider>
  </React.StrictMode>
);
