/* eslint-disable no-unused-vars */

let userSquares = [];
const computerSquares = [];
const width = 10;
let selectedShipNameWithIndex;
let draggedShip;
let draggedShipLength;
let direction;
let bannedSquares = [];
let killedShips = [];
const ships = document.querySelectorAll(".ship");
const opponentStatusShips = document.querySelectorAll(".ship-opponent");
const displayGrid = document.querySelector(".grid-display-ships");
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
    selectedShipNameWithIndex = e.target.id;
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
  console.log("drag start =>", e);
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
  // console.log("drop", e);
  // console.log("dragged ship", draggedShip.target);

  let draggedSquareId = parseInt(this.dataset.id);
  let groupSquare = Math.floor(Number(this.dataset.id) / 10) * 10;
  // console.log("group square =>", groupSquare);
  // console.log("id square drop =>", idSquareDrop);
  let shipNameWithLastId = draggedShip.lastElementChild.id;
  // console.log("ship name last id =>", shipNameWithLastId);
  let shipClass = shipNameWithLastId.slice(0, -2);
  // console.log("ship class =>", shipClass);
  let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
  // console.log("last ship Index =>", lastShipIndex);
  selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
  let idSquareOnLastShip = lastShipIndex + draggedSquareId - selectedShipIndex;
  let idSquareOnFirstShip = idSquareOnLastShip - lastShipIndex;
  // console.log("ship last id =>", idSquareOnLastShip);

  console.table({
    "selected ship index": selectedShipIndex,
    "last ship index": lastShipIndex,
    groupSquare: groupSquare,
    "id square first ship": idSquareOnFirstShip,
    "id square last ship": idSquareOnLastShip,
    "ship class": shipClass,
  });
  console.log(bannedSquares);
  if (
    groupSquare + 9 >= idSquareOnLastShip &&
    groupSquare <= idSquareOnFirstShip &&
    !bannedSquares.includes(idSquareOnLastShip) &&
    !bannedSquares.includes(idSquareOnFirstShip) &&
    !bannedSquares.includes(draggedSquareId)
  ) {
    for (let i = 0; i < draggedShipLength; i++) {
      userSquares[
        parseInt(this.dataset.id) - selectedShipIndex + i
      ].classList.add("taken", shipClass);
    }
    bannedSquares.push(
      idSquareOnLastShip < groupSquare && idSquareOnLastShip + 1,
      idSquareOnFirstShip > groupSquare && idSquareOnFirstShip - 1,
      idSquareOnFirstShip - 10,
      idSquareOnLastShip - 10,
      idSquareOnFirstShip + 10,
      idSquareOnLastShip + 10,
      draggedSquareId - 10,
      draggedSquareId + 10
    );
    console.log(displayGrid);
    displayGrid.removeChild(draggedShip);
    // Remove ship dropped
  } else {
    alert("vị trí không hợp lệ! ");
  }

  // console.log(
  //   selectedShipIndex,
  //   userSquares[parseInt(this.dataset.id) - selectedShipIndex + 1].classList
  // );
  // console.log(shipNameWithLastId, shipClass, lastShipIndex, idSquareOnLastShip);
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
// generate(shipArray[0]);
// generate(shipArray[1]);
// generate(shipArray[2]);
// generate(shipArray[3]);
// generate(shipArray[4]);

ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
console.log("users squares => ", userSquares);
userSquares.forEach((square) =>
  square.addEventListener("dragstart", dragStart)
);
userSquares.forEach((square) => square.addEventListener("dragover", dragOver));
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
