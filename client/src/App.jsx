/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";

const BattleshipGame = () => {
  const [userSquares, setUserSquares] = useState([]);
  const [computerSquares, setComputerSquares] = useState([]);
  const [selectedShipNameWithIndex, setSelectedShipNameWithIndex] =
    useState("");
  const [draggedShip, setDraggedShip] = useState(null);
  const [draggedShipLength, setDraggedShipLength] = useState(null);
  const [bomd, setBomb] = useState([]);
  // const [direction, setDirection] = useState(null);
  const [bannedSquares, setBannedSquares] = useState([]);
  const [killedShips, setKilledShips] = useState([]);
  const displayGridRef = useRef(null);

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

  useEffect(() => {
    const createBoard = (squares, type) => {
      let newSquares = [];
      for (let i = 0; i < width * width; i++) {
        newSquares.push({
          id: i,
          classList: [
            "square",
            type === "your" ? "your-square" : "opponent-square",
          ],
        });
      }
      return newSquares;
    };

    setUserSquares(createBoard(userSquares, "your"));
    setComputerSquares(createBoard(computerSquares, "opponent"));
  }, []);

  const handleMouseDown = (e) => {
    setSelectedShipNameWithIndex(e.target.id);
  };

  const handleDragStart = (e) => {
    setDraggedShip(e);
    setDraggedShipLength(e.target.children.length);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDragDrop = (e) => {
    console.log("dragged ship", draggedShip);
    console.log("drag drop", e);
    let draggedSquareId = parseInt(e.target.id);
    let groupSquare = Math.floor(Number(e.target.id) / 10) * 10;
    let shipNameWithLastId = draggedShip.target.lastElementChild.id;
    let shipClass = shipNameWithLastId.slice(0, -2);
    console.log("shipname", shipNameWithLastId);
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

    let idSquareOnLastShip =
      lastShipIndex + draggedSquareId - selectedShipIndex;
    let idSquareOnFirstShip = idSquareOnLastShip - lastShipIndex;
    // console.log(111, lastShipIndex, draggedSquareId, selectedShipIndex);
    console.table({
      "selected ship index": selectedShipIndex,
      "last ship index": lastShipIndex,
      groupSquare: groupSquare,
      "id square first ship": idSquareOnFirstShip,
      "id square last ship": idSquareOnLastShip,
      "ship class": shipClass,
    });
    if (
      groupSquare + 9 >= idSquareOnLastShip &&
      groupSquare <= idSquareOnFirstShip &&
      !bannedSquares.includes(idSquareOnLastShip) &&
      !bannedSquares.includes(idSquareOnFirstShip) &&
      !bannedSquares.includes(draggedSquareId)
    ) {
      let newSquares = [...userSquares];
      for (let i = 0; i < draggedShipLength; i++) {
        console.log(newSquares[parseInt(e.target.id) - selectedShipIndex + i]);
        newSquares[
          parseInt(e.target.id) - selectedShipIndex + i
        ].classList.push(`taken ${shipClass}`);
      }
      setUserSquares(newSquares);

      let newBannedSquares = [
        ...bannedSquares,
        idSquareOnLastShip < groupSquare && idSquareOnLastShip + 1,
        idSquareOnFirstShip > groupSquare && idSquareOnFirstShip - 1,
        idSquareOnFirstShip - 10,
        idSquareOnLastShip - 10,
        idSquareOnFirstShip + 10,
        idSquareOnLastShip + 10,
        draggedSquareId - 10,
        draggedSquareId + 10,
      ];
      setBannedSquares(newBannedSquares);
      displayGridRef.current.removeChild(draggedShip.target);
    } else {
      alert("Invalid position!");
    }
  };

  const handleShipClick = (e) => {
    const shipClass = e.target.classList[1];
    if (killedShips.includes(shipClass)) {
      setKilledShips(killedShips.filter((item) => item !== shipClass));
      e.target.classList.remove("active");
    } else {
      setKilledShips([...killedShips, shipClass]);
      e.target.classList.add("active");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="player p1">
          <label>Player 1</label>
          <div className="connected">
            <span className="badge"></span>
            <span>Connected</span>
          </div>
          <div className="ready">Ready</div>
        </div>
        <div className="player p2">
          <label>Player 2</label>
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
            {userSquares &&
              userSquares.map((square, id) => {
                return (
                  <div
                    className={square.classList.join(" ")}
                    key={id}
                    id={id}
                    data-id={square.id}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDrop={handleDragDrop}
                  ></div>
                );
              })}
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
          <div className="grid-display-ships " ref={displayGridRef}>
            <div
              onDragStart={handleDragStart}
              className="ship destroyer-container"
              draggable="true"
            >
              <div id="destroyer-0" onMouseDown={handleMouseDown}></div>
              <div id="destroyer-1" onMouseDown={handleMouseDown}></div>
            </div>
            <div
              onDragStart={handleDragStart}
              className="ship submarine-container"
              draggable="true"
            >
              <div id="submarine-0" onMouseDown={handleMouseDown}></div>
              <div id="submarine-1" onMouseDown={handleMouseDown}></div>
              <div id="submarine-2" onMouseDown={handleMouseDown}></div>
            </div>
            <div
              onDragStart={handleDragStart}
              className="ship cruiser-container"
              draggable="true"
            >
              <div id="cruiser-0" onMouseDown={handleMouseDown}></div>
              <div id="cruiser-1" onMouseDown={handleMouseDown}></div>
              <div id="cruiser-2" onMouseDown={handleMouseDown}></div>
            </div>
            <div
              onDragStart={handleDragStart}
              className="ship fourship-container"
              draggable="true"
            >
              <div id="fourship-0" onMouseDown={handleMouseDown}></div>
              <div id="fourship-1" onMouseDown={handleMouseDown}></div>
              <div id="fourship-2" onMouseDown={handleMouseDown}></div>
              <div id="fourship-3" onMouseDown={handleMouseDown}></div>
            </div>
            <div
              onDragStart={handleDragStart}
              className="ship carrier-container"
              draggable="true"
            >
              <div id="carrier-0" onMouseDown={handleMouseDown}></div>
              <div id="carrier-1" onMouseDown={handleMouseDown}></div>
              <div id="carrier-2" onMouseDown={handleMouseDown}></div>
              <div id="carrier-3" onMouseDown={handleMouseDown}></div>
              <div id="carrier-4" onMouseDown={handleMouseDown}></div>
            </div>
          </div>
          <div className="bomb-container">
            <div className="bomb bomb-a">
              <img src="bomb-a.png" />
              <div className="amount">0</div>
            </div>
            <div className="bomb bomb-b">
              {" "}
              <img src="bomb-b.png" />
              <div className="amount">0</div>
            </div>

            <div className="bomb bomb-s">
              {" "}
              <img src="bomb-s.png" />
              <div className="amount">0</div>
            </div>
          </div>
        </div>
        <div className="battleship-area__area opponent-turn">
          <div className="name">Opponent Turn</div>
          <div className="battleship-grid grid-computer">
            {computerSquares.map((square, id) => {
              return (
                <div className={square.classList.join(" ")} key={id} id={id}>
                  <img className="aim-icon" src="aim-2.png" />
                </div>
              );
            })}
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

          <div className="grid-display-ships-opponent">
            <div
              className="ship-opponent destroyer-container"
              onClick={handleShipClick}
            >
              Destroyer (2)
            </div>
            <div
              className="ship-opponent submarine-container"
              onClick={handleShipClick}
            >
              Submarine (3)
            </div>
            <div
              className="ship-opponent cruiser-container"
              onClick={handleShipClick}
            >
              Cruiser (3)
            </div>
            <div
              className="ship-opponent fourship-container"
              onClick={handleShipClick}
            >
              Battleship (4)
            </div>
            <div
              className="ship-opponent carrier-container"
              onClick={handleShipClick}
            >
              Carrier (5)
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default BattleshipGame;
