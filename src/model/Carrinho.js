export default class Carrinho {
    constructor(id = 0, itens = [], quantidadeTotal = 0, valorTotal = 0) {
        this.id = parseInt(id);
        this.itens = itens; 
        this.quantidadeTotal = parseInt(quantidadeTotal);
        this.valorTotal = Number(valorTotal);
    }
    
    setId(id) {
        this.id = parseInt(id);
    }
    
    setItens(itens) {
        this.itens = itens;
    }
    
    setQuantidadeTotal(quantidadeTotal) {
        this.quantidadeTotal = parseInt(quantidadeTotal);
    }
    
    setValorTotal(valorTotal) {
        this.valorTotal = Number(valorTotal);
    }
    
    toJSON() {
        return {
            id: this.id,
            itens: this.itens,
            quantidadeTotal: this.quantidadeTotal,
            valorTotal: this.valorTotal
        };
    }
    
    static fromRaw(raw) {
        if (!raw) return new Carrinho();
        
        return new Carrinho(
            raw.id,
            raw.itens || [],
            raw.quantidadeTotal || 0,
            raw.valorTotal || 0
        );
    }
}