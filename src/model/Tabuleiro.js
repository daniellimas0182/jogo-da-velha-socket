class Tabuleiro {
    constructor() {
        this._campos = [
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
        const matches = ["XXX", "OOO"];
        const firstNull = this._campos.findIndex((campo) => campo.simbolo == null);
        if (firstNull == -1) {
            return { fimDeJogo: true, vencedor: null };
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
            return condicao == matches[0] || condicao == matches[1];
        });

        if (condicaoVitoria) {
            return { fimDeJogo: true, vencedor: condicaoVitoria == matches[0] ? 'X' : 'O' };
        }

        return { fimDeJogo: false, vencedor: null };
    }

    reset() {
        this._campos.forEach((campo) => (campo.simbolo = null));
    }
}

export default Tabuleiro