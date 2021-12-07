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
    methods: { // 
        comecarJogo() {
            this.mensagem = "Esperando jogador... ";
            this.bloqueio = true;
            this.socket.emit("comecarJogo", {
                nome: this.nome,
            });
        },
        renderizaMensagemDoTurno() {
            this.mensagem = this.minhaVez ? "Sua vez de jogar" : "Aguarde a vez do adversário";
        },

        jogada(campo) {
            if (!this.minhaVez || campo.simbolo !== null) return;
            this.socket.emit("jogada", {
                simbolo: this.simbolo,
                position: this.jogo._tabuleiro._campos.indexOf(campo),
            });
        },

        resetaJogo() {
            this.socket.emit("resetJogo");
        },
    },
    mounted() { // metodo chamado quando é renderizado o html 
        this.socket = io.connect(window.location.origin);

        const self = this; // pega o contexto 

        this.socket.on("comecarJogo", function(data) {
            self.jogo = data;
            const meuJogador = (data._jogador1._socketId == self.socket.id ? data._jogador1 :
                data._jogador2);

            self.simbolo = meuJogador._simbolo;
            self.minhaVez = data._vez == self.simbolo;
            self.renderizaMensagemDoTurno();
        });

        this.socket.on("proximajogada", (data) => {
            self.jogo = data;
            self.minhaVez = data._vez == self.simbolo;
            self.renderizaMensagemDoTurno();
        });

        this.socket.on("fimdejogo", function(data) {
            self.jogo = data;
            self.minhaVez = false; //  não tem mais vez
            if (self.jogo._vencedor) { // se tiver ganhaor
                self.mensagem = self.jogo._vencedor == self.simbolo ? "Você venceu!" : "Você perdeu!";
            } else {
                self.mensagem = "Jogo empatado!";
            }
        });

        this.socket.on("oponenteSaiu", function() {
            self.jogo = null;
            self.bloqueio = false;
            self.mensagem = "Seu oponente saiu do jogo!";

        });
    },
});