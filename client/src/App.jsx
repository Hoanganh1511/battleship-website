/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");
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
  const playerNum = useRef(null);
  const [enemyReady, setEnemyReady] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("user");
  const [ready, setReady] = useState(false);
  const [isGameOver, setGameOver] = useState(false);

  const [accountLogin, setAccountLogin] = useState(null);
  const displayGridRef = useRef(null);
  const setupButtonsRef = useRef(null);
  // const turnDisplayRef = useRef(null);
  const opponentTurnRef = useRef(null);
  const yourTurnRef = useRef(null);

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
    const createBoard = (type) => {
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

    setUserSquares((prev) => createBoard("your"));
    setComputerSquares(createBoard("opponent"));
  }, []);
  useEffect(() => {
    if (userSquares.length > 0) {
      socket.emit("client-ready");
      // socket.on("get-your-state", () => {
      //   console.log("get-your-state");
      //   socket.emit("your-state", userSquares);
      // });
      socket.on("fire", (state) => {
        // console.log("fire data =>", state);
        setComputerSquares(state);
      });
      socket.on("player-number", (num) => {
        console.log("player-number =>", num);
        if (num === -1) {
          alert("Server is full");
        } else {
          console.log("player num =>", parseInt(num));
          playerNum.current = parseInt(num);
          if (parseInt(num) === 1) {
            setCurrentPlayer("enemy");
          }
          socket.emit("check-players");
        }
      });
      // Another player has connected or disconnected
      socket.on("player-connection", (num) => {
        console.log(`Player number ${num + 1} has connected or disconnected`);
        playerConnectedOrDisconnected(num + 1);
      });
      // On enemy ready
      socket.on("enemy-ready", (num) => {
        setEnemyReady(true);
        playerReady(num);
        if (ready) {
          playGameMulti(socket);
          setupButtonsRef.current.style.display = "none";
        }
      });
      socket.on("check-players", (players) => {
        console.log("players =>", players);
        players.forEach((p, i) => {
          if (p.connected) playerConnectedOrDisconnected(i);
          if (p.ready) {
            playerReady(i);
            if (i !== playerReady) setEnemyReady(true);
          }
        });
      });
      socket.on("fire", (id) => {
        //
      });
      socket.on("fire-reply", (classList) => {
        //
      });
    }
  }, [userSquares, ready]);

  const playerConnectedOrDisconnected = (num) => {
    let player = `.p${parseInt(num) + 1}`;
    // document.querySelector(`${player} .connected`).classList.toggle("active");
    if (num === playerNum.current) {
      console.log("class =>", player);
      console.log("123", parseInt(num), playerNum.current);
      if (parseInt(num) === playerNum.current) {
        const curr = document.querySelector(player);
        curr.style.fontWeight = "bold";
      }
    }
  };
  const playerReady = (num) => {
    let player = `.p${parseInt(num) + 1}`;
    document.querySelector(`${player} .ready`).classList.toggle("active");
  };
  const playGameMulti = (socket) => {
    setupButtonsRef.current.style.display = "none";
    // if (isGameOver) return;
    console.log("ready", ready);
    if (!ready) {
      socket.emit("player-ready");
      setReady(true);
      console.log("player num logic multi =>", playerNum.current);
      playerReady(playerNum.current);
    }
    if (enemyReady) {
      if (currentPlayer === "user") {
        yourTurnRef.current.style.color = "red";
      }
      if (currentPlayer === "enemy") {
        opponentTurnRef.current.style.color = "red";
      }
    }
  };

  const onFire = (e, position) => {
    const newComputerSquares = [...computerSquares].map((item) => {
      if (item.id === position.id) {
        item.classList.push("attacked");
      }
      return item;
    });
    setComputerSquares((prev) => newComputerSquares);
    socket.emit("fire", newComputerSquares);
  };

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
  const player1Ready = () => {
    playGameMulti(socket);
  };
  const player2Ready = () => {
    playGameMulti(socket);
  };

  return (
    <div className="container">
      <div>Player Num : {playerNum.current}</div>
      <div>Current Player: {currentPlayer}</div>
      <div>Ready: {ready ? "ready" : "not ready"}</div>
      <div>Enemy Ready: {enemyReady ? "ready" : "not ready"}</div>
      <div className="container hidden-info">
        <div className="setup-buttons" id="setup-buttons" ref={setupButtonsRef}>
          <button id="start" className="btn">
            Start Game
          </button>
          <button id="rotate" className="btn">
            Rotate Your Ships
          </button>
        </div>

        <h3 id="info" className="info-text"></h3>
      </div>
      <div className="header">
        <div className="player p1">
          <label>Player 1</label>
          <div>
            <input className="" placeholder="Tên TK" />
          </div>
          <div className="connected">
            <span className="badge"></span>
            <span>Connected</span>
          </div>
          {currentPlayer === "user" && (
            <div className="ready" onClick={player1Ready}>
              Ready
            </div>
          )}
        </div>
        <div className="player p2">
          <label>Player 2</label>
          <div>
            <input className="" placeholder="Tên TK" />
          </div>
          <div className="connected">
            <span>Connected</span>
            <span className="badge"></span>
          </div>
          {currentPlayer === "enermy" && (
            <div className="ready" onClick={player2Ready}>
              Ready
            </div>
          )}
        </div>
      </div>

      <div className="battleship-container">
        <div className="battleship-area__area your-turn">
          <div ref={yourTurnRef} className="name">
            Your Turn
          </div>
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
          <div ref={opponentTurnRef} className="name">
            Opponent Turn
          </div>
          <div className="battleship-grid grid-computer">
            {computerSquares.map((square, id) => {
              return (
                <div
                  onClick={(e) => onFire(e, square)}
                  className={square.classList.join(" ")}
                  key={id}
                  id={id}
                >
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
