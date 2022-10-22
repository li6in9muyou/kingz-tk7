import "./main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import EventBus from "./lib/EventBus.js";
import { EventBusContext } from "./lib/GlobalVariable.js";
import { pgWaitingInQueue } from "./lib/PageSymbol";
import { Book } from "./lib/utility";

if (import.meta.env.DEV) {
  import("./mocks/browser").then((module) => {
    module.default.start();
  });
}

Book.load({
  player_id: "test_player_id",
  secret: "test_secret",
  nick_name: "test nick name",
  match_handle: "test_match_handle",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EventBusContext.Provider value={EventBus}>
      <App page={pgWaitingInQueue} />
    </EventBusContext.Provider>
  </React.StrictMode>
);
