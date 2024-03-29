import Tabuleiro from "./Tabuleiro.js";

class Jogo {
    constructor(jogador1) {
        this._jogador1 = jogador1;
        this._jogador2 = null;
        this._tabuleiro = new Tabuleiro();
        this._fimDeJogo = null;
        this._vencedor = null;
        this._vez = "X"; // jogador 1 sempre terá o simbolo x
    }

    get jogador1() {
        return this._jogador1;
    }

    get jogador2() {
        return this._jogador2;
    }

    set jogador2(jogador2) {
        jogador2.simbolo = "O";
        this._jogador2 = jogador2;
    }

    get tabuleiro() {
        return this._tabuleiro;
    }

    get fimDeJogo() {
        return this._fimDeJogo;
    }

    verificarFimDeJogo() {
        const { fimDeJogo, vencedor } = this._tabuleiro.isFimDeJogo();
        this._fimDeJogo = fimDeJogo;
        this._vencedor = vencedor;
    }

    trocarVez() {
        this._vez = this._vez == "X" ? "O" : "X";
    }

}

export default Jogo;