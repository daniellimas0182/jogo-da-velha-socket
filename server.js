import http from "http";
import express from "express";
import { Server } from "socket.io";
import ejs from "ejs";
import Jogador from './src/model/Jogador.js';
import Jogo from './src/model/Jogo.js';

const app = express();

const server = http.Server(app).listen(8080);
const io = new Server(server);
const clients = {};

app.use(express.static("./public"));
app.use("/vendor", express.static("./node_modules"));

app.set("views", "./public");
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.get("/", (req, res) => {
    return res.render("index.html");
});

const jogos = {};
let proximoJogo = null;

io.on("connection", (socket) => {
    let id = socket.id;
    console.log("Novo cliente conectado. ID => " + id);
    clients[id] = socket;

    socket.on("jogo.comeco", function(data) {
        const jogo = join(socket, data);
        if (jogo.jogador2) {
            console.log("Novo jogo começando... ");

            clients[jogo.jogador1.socketId].emit("jogo.comeco", jogo);
            clients[jogo.jogador2.socketId].emit("jogo.comeco", jogo);

        }
    });

    socket.on("make.move", function(data) {
        const jogo = jogos[socket.id];
        jogo.tabuleiro.setCampo(data.position, data.simbolo);
        jogo.trocarVez();

        const event = "move.made"
        clients[jogo.jogador1.socketId].emit(event, jogo);
        clients[jogo.jogador2.socketId].emit(event, jogo);

    });

    socket.on("disconnect", function() {
        const jogo = jogos[socket.id];
        if (jogo) {
            const socketEmit = jogo.jogador1.socketId == socket.id ?
                clients[jogo.jogador2.socketId] :
                clients[jogo.jogador1.socketId];

            if (socketEmit) {
                socketEmit.emit("opponent.left");
            }

            delete jogos[socket.id];
            delete jogos[socketEmit.id];
        }
        delete clients[id];
    });
});

const join = (socket, data) => {
    const jogador = new Jogador(data.nome, 'X', socket.id);

    if (proximoJogo) {
        proximoJogo.jogador2 = jogador;
        jogos[proximoJogo.jogador1.socketId] = proximoJogo;
        jogos[proximoJogo.jogador2.socketId] = proximoJogo;
        proximoJogo = null;
        return jogos[socket.id];
    } else {
        proximoJogo = new Jogo(jogador);
        return proximoJogo;
    }
};