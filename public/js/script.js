const app = new Vue({
    el: "#app",
    data: {
        socket: null,
        jogo: null,
        minhaVez: null,
        simbolo: null,
        nome: null,
        mensagem: "",
        bloqueio: false
    },
    methods: {
        startGame() {
            this.mensagem = "Esperando jogador... ";
            this.bloqueio = true;
            this.socket.emit("jogo.comeco", {
                nome: this.nome,
            });
        },
        renderTurnMessage() {
            this.mensagem = this.minhaVez ? "Sua vez de jogar" : "Aguarde a vez do adversário";
        },

        makeMove(campo) {
            if (!this.minhaVez || campo.simbolo !== null) return;
            this.socket.emit("make.move", {
                simbolo: this.simbolo,
                position: this.jogo._tabuleiro._campos.indexOf(campo),
            });
        },

        resetGame() {
            this.socket.emit("jogo.reset");
        },
    },
    mounted() {
        this.socket = io.connect(window.location.origin);

        const self = this;

        this.socket.on("jogo.comeco", function(data) {
            self.jogo = data;
            const meuJogador = (data._jogador1._socketId == self.socket.id ? data._jogador1 :
                data._jogador2);

            self.simbolo = meuJogador._simbolo;
            self.minhaVez = data._vez == self.simbolo;
            self.renderTurnMessage();
        });

        this.socket.on("move.made", (data) => {
            self.jogo = data;
            self.minhaVez = data._vez == self.simbolo;
            self.renderTurnMessage();
        });

        this.socket.on("fimdejogo", function(data) {
            self.jogo = data;
            self.minhaVez = false;
            if (self.jogo._vencedor) {
                self.mensagem = self.jogo._vencedor == self.simbolo ? "Você venceu!" : "Você perdeu!";
            } else {
                self.mensagem = "Jogo empatado!";
            }
        });

        this.socket.on("opponent.left", function() {
            self.jogo = null;
            self.bloqueio = false;
            self.mensagem = "Seu oponente saiu do jogo!";

        });
    },
});