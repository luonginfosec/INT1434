import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { RentalProvider } from "./context/RentalContext";
import { ToastProvider } from "./components/Toast";
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/pages.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter useTransitions={false}>
      <ToastProvider>
        <UserProvider>
          <RentalProvider>
            <App />
          </RentalProvider>
        </UserProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
