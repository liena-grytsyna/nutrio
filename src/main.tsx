import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";

// Create a root element and render the App component inside it
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
