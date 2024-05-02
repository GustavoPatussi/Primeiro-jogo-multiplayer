import express from "express";
import server from "http";
import { Server } from "socket.io";
import path from "path";
import { create } from "domain";
import { CreateGame } from "./controllers/gameController";

const app = express();
const serverHttp = server.createServer(app);
const io = new Server(serverHttp);

const game = new CreateGame();

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "../public/game.html"));
});

app.get(
   "/bwguidsauivh9ewhr93ir893rofiwe9r83r8hg948r61newquir623uf87rt7cfbouhtr7yhfnyr83973r276fwuef7238dy9868yf843y9g8hoiwft72f08",
   (req, res) => {
      res.sendFile(path.join(__dirname, "../public/admin.html"));
   }
);

setInterval(() => {
   io.emit("concurrent-players", io.engine.clientsCount);
}, 5000);

io.on("connection", (socket) => {
   const playerState = game.addPlayer(socket.id);
   socket.emit("bootstrap", game);

   socket.broadcast.emit("player-update", {
      socketId: socket.id,
      newState: playerState,
   });

   socket.on("player-move", (key) => {
      game.movePlayer(socket.id, key);
      const fruitColision = game.checkForFruitColision();
      socket.broadcast.emit("player-update", {
         socketId: socket.id,
         newState: game.players[socket.id],
      });

      if (fruitColision) {
         io.emit("fruit-remove", fruitColision);
         socket.emit("score-player-update", game.players[socket.id].score);
      }
   });

   socket.on("disconnect", () => {
      game.removePlayer(socket.id);
      socket.broadcast.emit("player-remove", socket.id);
   });

   let fruitInterval: any;
   socket.on("start-game", (interval) => {
      clearInterval(fruitInterval);

      fruitInterval = setInterval(() => {
         const fruitData = game.addFruit();

         if (fruitData) {
            io.emit("add-fruit", fruitData);
         }
      }, interval);
   });

   socket.on("stop-game", () => {
      clearInterval(fruitInterval);
   });
   // socket.on("reset-scores", () => {
   //    game.clearScores();
   //    io.emit("bootstrap", game);
   // });
});

serverHttp.listen(process.env.PORT || 3000, () => {
   console.log("Servidor iniciado");
});
