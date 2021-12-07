import http from "http";
import express from "express";
import { Server } from "socket.io";
import ejs from "ejs";
import Jogador from './src/model/Jogador.js';
import Jogo from './src/model/Jogo.js';

const app = express();

const server = http.Server(app).listen(8080);
const io = new Server(server);
const clients = {}; // objto que recebe as requisições via sockete

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

//tratando a requisição do socket
io.on("connection", (socket) => {
    let id = socket.id;
    console.log("Novo cliente conectado. ID => " + id);
    clients[id] = socket; //salva a conecxão do socket no clients 

    socket.on("comecarJogo", function(data) {
        const jogo = join(socket, data);
        if (jogo.jogador2) { // se eu já tenho o segundo jogador
            console.log("O jogo está começando... ");

            clients[jogo.jogador1.socketId].emit("comecarJogo", jogo);
            clients[jogo.jogador2.socketId].emit("comecarJogo", jogo);

        }
    });

    socket.on("jogada", function(data) {
        const jogo = jogos[socket.id];
        jogo.tabuleiro.setCampo(data.position, data.simbolo);
        jogo.verificarFimDeJogo();
        jogo.trocarVez();
        const event = jogo.fimDeJogo ? "fimdejogo" : "proximajogada";
        clients[jogo.jogador1.socketId].emit(event, jogo);
        clients[jogo.jogador2.socketId].emit(event, jogo);

    });

    socket.on("resetJogo", function(data) {
        const jogo = jogos[socket.id];
        if (!jogo) return; // para verificar se achou o jogo 
        jogo.tabuleiro.reset();
        clients[jogo.jogador1.socketId].emit("comecarJogo", jogo);
        clients[jogo.jogador2.socketId].emit("comecarJogo", jogo);
    });

    socket.on("disconnect", function() {
        const jogo = jogos[socket.id];
        if (jogo) {
            const socketEmit = jogo.jogador1.socketId == socket.id ?
                clients[jogo.jogador2.socketId] :
                clients[jogo.jogador1.socketId];

            if (socketEmit) {
                socketEmit.emit("oponenteSaiu");
            }

            delete jogos[socket.id];
            delete jogos[socketEmit.id];
        }
        delete clients[id];
    });
});

const join = (socket, data) => { // faz o join ao entrar os dois jogadores para começar a partida
    const jogador = new Jogador(data.nome, 'X', socket.id);

    if (proximoJogo) { // se já existe um jogador esperando 
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