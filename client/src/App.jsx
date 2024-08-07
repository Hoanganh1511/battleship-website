/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
function App() {
  const userSquares = [];
  const computerSquares = [];
  const width = 10;

  const shipArray = [
    {
      name: "destroyer",
      directions: [
        [0, 1],
        [0, width],
      ],
    },
    {
      name: "submarine",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "cruiser",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "battleship",
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3],
      ],
    },
    {
      name: "carrier",
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width * 2, width * 3, width * 4],
      ],
    },
  ];
  let direction;
  function generate(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length);
    let current = ship.directions[randomDirection];
    if (randomDirection === 0) direction = 1;
    if (randomDirection === 1) direction = 10;

    let randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length -
          ship.directions[0].length * direction
      )
    );

    const isTaken = current.some((index) =>
      computerSquares[randomStart + index].classList.contains("taken")
    );
    const isAtRightEdge = current.some(
      (index) => (randomStart + index) % width === width - 1
    );
    const isAtLeftEdge = current.some(
      (index) => (randomStart + index) % (width === 0)
    );

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge)
      current.forEach((index) => {
        computerSquares[randomStart + index].classList.add("taken", ship.name);
      });
    else generate(ship);
    console.log(123, ship);
  }
  useEffect(() => {
    const userGrid = document.querySelector(".grid-user");
    const computerGrid = document.querySelector(".grid-computer");
    const createBoard = (grid, squares) => {
      for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.dataset.id = i;
        grid.appendChild(square);
        squares.push(square);
      }
    };
    if (userGrid && userSquares && computerGrid && computerSquares) {
      createBoard(userGrid, userSquares);
      createBoard(computerGrid, computerSquares);
    }
    generate(shipArray[0]);
  }, []);
  // Create board

  return (
    <>
      <h1 className="name-game">Battle ship</h1>
      <div className="header">
        <div className="player p1">
          <label>Player1</label>
          <p>Tuananh</p>
          <div className="connected">
            <span className="badge"></span>
            <span>Connected</span>
          </div>
          <div className="ready">Ready</div>
        </div>
        <div className="player p2">
          <label>Player2</label>
          <p>Tuananh</p>
          <div className="connected">
            <span>Connected</span>
            <span className="badge"></span>
          </div>
          <div className="ready">Ready</div>
        </div>
      </div>

      <div className="container">
        <div className="battleship-grid grid-user"></div>
        <div className="battleship-grid grid-computer"></div>
      </div>
    </>
  );
}

export default App;
