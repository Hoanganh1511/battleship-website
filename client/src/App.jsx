/* eslint-disable no-unused-vars */
import { useState, useEffect, useLayoutEffect } from "react";
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
  useLayoutEffect(() => {
    const userGrid = document.querySelector(".grid-user");
    const computerGrid = document.querySelector(".grid-computer");
    const createBoard = (grid, squares, type) => {
      for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div");
        type === "your" && square.classList.add("square", "your-square");
        type === "opponent" && square.classList.add("square");
        square.dataset.id = i;
        grid.appendChild(square);
        squares.push(square);
      }
    };
    if (userGrid && userSquares && computerGrid && computerSquares) {
      createBoard(userGrid, userSquares, "your");
      createBoard(computerGrid, computerSquares, "opponent");
    }
    generate(shipArray[0]);
    generate(shipArray[1]);
    generate(shipArray[2]);
    generate(shipArray[3]);
    generate(shipArray[4]);
  }, []);
  // Create board

  return (
    <>
      <h1 className="name-game">Battle ship</h1>
      <div className="container">
        <div className="header">
          <div className="player p1">
            <label>Player1</label>
            <div className="connected">
              <span className="badge"></span>
              <span>Connected</span>
            </div>
            <div className="ready">Ready</div>
          </div>
          <div className="player p2">
            <label>Player2</label>
            <div className="connected">
              <span>Connected</span>
              <span className="badge"></span>
            </div>
            <div className="ready">Ready</div>
          </div>
        </div>

        <div className="battleship-container">
          <div className="battleship-area__area your-turn">
            <div className="name">Your Turn</div>
            <div className="battleship-grid grid-user">
              <div className="row">
                <span>A</span>
                <span>B</span>
                <span>C</span>
                <span>D</span>
                <span>E</span>
                <span>F</span>
                <span>G</span>
                <span>H</span>
                <span>I</span>
                <span>J</span>
              </div>
              <div className="col">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>
          <div className="battleship-area__area opponent-turn">
            <div className="name">Opponent Turn</div>
            <div className="battleship-grid grid-computer">
              <div className="row">
                <span>A</span>
                <span>B</span>
                <span>C</span>
                <span>D</span>
                <span>E</span>
                <span>F</span>
                <span>G</span>
                <span>H</span>
                <span>I</span>
                <span>J</span>
              </div>
              <div className="col">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
