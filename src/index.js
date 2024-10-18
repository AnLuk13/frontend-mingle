import React from "react";
import { createRoot } from "react-dom/client"; // Use createRoot from react-dom/client
import App from "./App";
import { Provider } from "react-redux";
import store from "./lib/redux/store";
import "./index.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
