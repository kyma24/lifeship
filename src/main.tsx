import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { db } from "./db/index.ts";
import { initSyncManager } from "./lib/syncManager.ts";

await db.open();
initSyncManager();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
