import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Localization } from "./Localization";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Localization />
  </React.StrictMode>
);
