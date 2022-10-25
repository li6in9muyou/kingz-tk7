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
    import("./mocks/browser").then((module) => {
      module.default.start();
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
        GameView={RSPGame}
        OnlineAdapter={RegularPollingAdapter}
        GameAdapter={RSPAdapter}
      />
    </EventBusContext.Provider>
  </React.StrictMode>
);
