import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = document.getElementById("root");
const rootContainer = createRoot(root);

rootContainer.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
