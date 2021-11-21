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

    reset() {
        this._campos.forEach((campo) => (campo.simbolo = null));
    }
}

export default Tabuleiro