import express from "express";
import http from "http";
const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  let connections = [null, null];
  let playerIndex = -1;
  // for (const i in connections) {
  //   if (connections[i] === null) {
  //     console.log(i);
  //     playerIndex = Number(i);
  //     break;
  //   }
  // }
  for (let i = 0; i < connections.length; i++) {
    if (connections[i] === null) {
      console.log(i, playerIndex);
      playerIndex = i;
      break;
    }
  }
  socket.emit("player-number", playerIndex);
  console.log(`Player ${playerIndex} has connected`);
  if (playerIndex === -1) return;
  // connections[playerIndex] = false;
  socket.broadcast.emit("player-connection", playerIndex);
  console.log(connections);
  socket.on("client-ready", () => {
    socket.emit("get-your-state");
  });
  socket.on("your-state", (state) => {
    // console.log("your-state", state);
    // socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("fire", (state) => {
    socket.broadcast.emit("fire", state);
  });

  socket.on("player-ready", () => {
    console.log("player ready");
    socket.broadcast.emit("enemy-ready", playerIndex);
    console.log("enemy ready =>", playerIndex);
    connections[playerIndex] = true;
  });
  socket.on("check-players", () => {
    const players = [];
    console.log("check connections =>", connections[0]);
    for (const i in connections) {
      console.log("check i =>", i, connections);
      connections[i] === null
        ? players.push({ connected: false, ready: false })
        : players.push({ connected: true, ready: connections[i] });
    }
    socket.emit("check-players", players);
  });
  socket.on("clear", () => io.emit("clear"));
});
server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
