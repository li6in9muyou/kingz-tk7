import "./main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import EventBus from "./lib/EventBus.js";
import { EventBusContext } from "./lib/GlobalVariable.js";

if (import.meta.env.DEV) {
  import("./mocks/browser").then((module) => {
    module.default.start();
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EventBusContext.Provider value={EventBus}>
      <App />
    </EventBusContext.Provider>
  </React.StrictMode>
);
