import { useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";


export default function HomePage() {
  return (
    <Router>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="" element={<Home />} />
      </Routes>
    </Router>    
  );
}