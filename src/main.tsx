import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Login from "./components/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import { GlobalStyles } from "twin.macro";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyles />
    <AuthContext>
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<App />} />
          <Route path={`/login`} element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthContext>
  </React.StrictMode>
);
