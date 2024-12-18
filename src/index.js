import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {App} from "./App";
import {Ejercicio1} from "./Ejercicio1";
import {Ejercicio2} from "./Ejercicio2";
import {Ejercicio3} from "./Ejercicio3";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ejercicio1" element={<Ejercicio1 />} />
        <Route path="/ejercicio2" element={<Ejercicio2 />} />
        <Route path="/ejercicio3" element={<Ejercicio3 />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
