import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./variants.css";

const entryName = window.location.pathname.split("/").pop() || "balanced.html";
const variant = entryName.replace(".html", "");
const supportedVariant = ["balanced", "rich", "impact"].includes(variant) ? variant : "balanced";
const rootElement = document.getElementById("root");

document.body.classList.add("variants-body", `variant-${supportedVariant}-body`);

if (rootElement) {
  rootElement.classList.add("variants-root", `variant-${supportedVariant}`);
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
