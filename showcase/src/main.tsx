import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Workbench } from "./workbench";
import "./workbench.css";

const root = document.getElementById("root");

if (!root) throw new Error("The Lumen Workbench root element is missing.");

createRoot(root).render(
  <StrictMode>
    <Workbench />
  </StrictMode>,
);
