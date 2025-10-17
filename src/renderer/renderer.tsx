import { createRoot } from "react-dom/client";

import { App } from "@erpel/ui/components/app";
import "./renderer.css";

const root = createRoot(document.body);
root.render(<App />);
