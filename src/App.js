import React from "react";
import "./App.css";
import FilmState from './api/filmState';

function App() {
  return (
    <div className="App">
      <h1>Prince's Theatre</h1>
      <h2>Classic Movies At Home</h2>
      <FilmState/>
    </div>
  );
}

export default App;
