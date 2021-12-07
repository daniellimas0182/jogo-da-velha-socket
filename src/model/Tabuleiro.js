class Tabuleiro {
    constructor() {
        this._campos = [ // campo e a possição dos simbolos
            { simbolo: null },
            { simbolo: null },
            { simbolo: null },

            { simbolo: null },
            { simbolo: null },
            { simbolo: null },

            { simbolo: null },
            { simbolo: null },
            { simbolo: null },
        ];
    }

    getCampo(index) {
        return this._campos[index];
    }

    setCampo(index, simbolo) {
        this._campos[index].simbolo = simbolo;
    }

    get campos() {
        return this._campos;
    }

    isFimDeJogo() {
        const simboloVencedor = ["XXX", "OOO"]; //combinações vitoria
        const tabuleiroVazio = this._campos.findIndex((campo) => campo.simbolo == null); // verifica se o campo está nulo, sem simbolo
        if (tabuleiroVazio == -1) { // verifica se todos os campos já foram marcados
            return { fimDeJogo: true, vencedor: null }; // jogo a cabou e não teve nem um vencedor
        }

        const condicoesVitoria = [
            //Linhas
            this.campos[0].simbolo + this.campos[1].simbolo + this.campos[2].simbolo,
            this.campos[3].simbolo + this.campos[4].simbolo + this.campos[5].simbolo,
            this.campos[6].simbolo + this.campos[7].simbolo + this.campos[8].simbolo,

            //Colunas
            this.campos[0].simbolo + this.campos[3].simbolo + this.campos[6].simbolo,
            this.campos[1].simbolo + this.campos[4].simbolo + this.campos[7].simbolo,
            this.campos[2].simbolo + this.campos[5].simbolo + this.campos[8].simbolo,

            //Diagonais
            this.campos[0].simbolo + this.campos[4].simbolo + this.campos[8].simbolo,
            this.campos[6].simbolo + this.campos[4].simbolo + this.campos[2].simbolo
        ]

        const condicaoVitoria = condicoesVitoria.find((condicao) => {
            return condicao == simboloVencedor[0] || condicao == simboloVencedor[1]; // simboloVencedor 0 é o X e simboloVencedor 1 é o O
        });

        if (condicaoVitoria) {
            return { fimDeJogo: true, vencedor: condicaoVitoria == simboloVencedor[0] ? 'X' : 'O' }; // se tiver condicaoVitoria 
        }

        return { fimDeJogo: false, vencedor: null }; // jogo não cabou e continua a partida
    }

    reset() { // reseta o tabuleiro setando todos os campos com null
        this._campos.forEach((campo) => (campo.simbolo = null));
    }
}

export default Tabuleiro