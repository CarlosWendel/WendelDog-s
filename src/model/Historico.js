

export default class Historico {

    constructor(id = 0, dataCompra = new Date(), itens = [], valorTotal = 0) {
        this.id = parseInt(id);
        this.dataCompra = new Date(dataCompra);
        this.itens = itens; 
        this.valorTotal = Number(valorTotal);
    }



    toJSON() {
        return {
            id: this.id,
            dataCompra: this.dataCompra.toISOString(),
            itens: this.itens,
            valorTotal: this.valorTotal
        };
    }
    static fromRaw(raw) {
        if (!raw) return new Historico();
        return new Historico(
            raw.id,
            raw.dataCompra,
            raw.itens || [],
            raw.valorTotal || 0
        );
    }

}