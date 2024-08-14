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
const account1 = {
  username: "anhht",
  password: 123456,
};
const account2 = {
  username: "tutv",
  password: 123456,
};
let connections = [null, null];
let playerIndex = -1;
io.on("connection", (socket) => {
  for (const i in connections) {
    if (connections[i] === null) {
      console.log("index =>", i);
      playerIndex = Number(i);
      break;
    }
  }
  socket.emit("player-number", playerIndex);

  if (playerIndex === -1) return;
  connections[playerIndex] = false;

  socket.on("client-ready", () => {
    // socket.emit("get-your-state");
  });
  socket.on("your-state", (state) => {
    // console.log("your-state", state);
    // socket.broadcast.emit("canvas-state-from-server", state);
  });
  socket.broadcast.emit("player-connection", playerIndex);

  socket.on("disconnect", () => {
    console.log(`Player ${playerIndex} disconnected !`);
    connections[playerIndex] = null;
    // Tell everyone what player number just disconnected
    socket.broadcast.emit("player-connection", playerIndex);
  });

  socket.on("fire", (state) => {
    socket.broadcast.emit("fire", state);
  });

  socket.on("player-ready", () => {
    console.log("player ready");
    socket.broadcast.emit("enemy-ready", playerIndex);

    connections[playerIndex] = true;
    console.log("connections Index =>", connections);
  });
  socket.on("check-players", () => {
    const players = [];
    // console.log("check connections =>", connections[0]);
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
