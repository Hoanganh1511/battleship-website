/* eslint-disable no-unused-vars */
import { useState, useEffect, useLayoutEffect } from "react";
function App() {
  let userSquares = [];
  const computerSquares = [];
  const width = 10;
  // let selectedShipNameWithIndex;
  const [selectedShipNameWithIndex, setSelectedShipNameWithIndex] =
    useState("");
  let draggedShip;
  let draggedShipLength;
  let direction;
  let bannedSquares = [];
  let killedShips = [];
  const ships = document.querySelectorAll(".ship");
  const opponentStatusShips = document.querySelectorAll(".ship-opponent");
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

  ships.forEach((ship) =>
    ship.addEventListener("mousedown", (e) => {
      setSelectedShipNameWithIndex(e.target.id);
    })
  );
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
  }

  // Lấy thông tin thuyền được kéo vào
  function dragStart(e) {
    draggedShip = e.target;
    draggedShipLength = e.target.children.length;
  }
  function dragOver(e) {
    e.preventDefault();
  }
  function dragEnter(e) {
    e.preventDefault();
  }
  function dragLeave() {}
  // Thông tin vị trí được kéo vào
  function dragDrop(e) {
    console.log("drop", e);

    let shipNameWithLastId = draggedShip.lastElementChild.id;
    console.log("ship name last id =>", shipNameWithLastId);
    let shipClass = shipNameWithLastId.slice(0, -2);
    console.log("ship class =>", shipClass);
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    console.log("last ship Index =>", lastShipIndex);
    let shipLastId = lastShipIndex + parseInt(this.dataset.id);
    console.log("ship last id =>", shipLastId);
    bannedSquares.push(shipLastId + 1, parseInt(this.dataset.id) - 1);
    console.log("banned squares =>", bannedSquares);
    let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
    for (let i = 0; i < draggedShipLength; i++) {
      userSquares[
        parseInt(this.dataset.id) - selectedShipIndex + i
      ].classList.add("taken", shipClass);
    }
    // console.log(
    //   selectedShipIndex,
    //   userSquares[parseInt(this.dataset.id) - selectedShipIndex + 1].classList
    // );
    // console.log(shipNameWithLastId, shipClass, lastShipIndex, shipLastId);
    // const listIndexShip =
    // 96 97 98
    // banned 86,87,88,95,99,
    //
  }
  function dragEnd() {}

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

  ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
  userSquares.forEach((square) =>
    square.addEventListener("dragstart", dragStart)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragover", dragOver)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragstart", dragEnter)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragleave", dragLeave)
  );
  userSquares.forEach((square) => square.addEventListener("drop", dragDrop));
  userSquares.forEach((square) => square.addEventListener("dragend", dragEnd));

  //Check log killed ships of opponent
  opponentStatusShips.forEach((ship) => {
    ship.addEventListener("click", (e) => {
      if (killedShips.includes(e.target.classList[1])) {
        e.target.classList.remove("active");
        killedShips = killedShips.filter(
          (item) => item !== e.target.classList[1]
        );
      } else {
        killedShips.push(e.target.classList[1]);
        e.target.classList.add("active");
      }
    });
  });

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
        <div className="grid-display">
          <div className="ship destroyer-container" draggable="true">
            <div id="destroyer-0"></div>
            <div id="destroyer-1"></div>
          </div>
          <div className="ship submarine-container" draggable="true">
            <div id="submarine-0"></div>
            <div id="submarine-1"></div>
            <div id="submarine-2"></div>
          </div>
          <div className="ship cruiser-container" draggable="true">
            <div id="cruiser-0"></div>
            <div id="cruiser-1"></div>
            <div id="cruiser-2"></div>
          </div>
          <div className="ship fourship-container" draggable="true">
            <div id="fourship-0"></div>
            <div id="fourship-1"></div>
            <div id="fourship-2"></div>
            <div id="fourship-3"></div>
          </div>
          <div className="ship carrier-container" draggable="true">
            <div id="carrier-0"></div>
            <div id="carrier-1"></div>
            <div id="carrier-2"></div>
            <div id="carrier-3"></div>
            <div id="carrier-4"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
