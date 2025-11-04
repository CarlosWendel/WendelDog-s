export default class Produtos {
    constructor(id = 0, nome = "", descricao = "", preco = 0, quantidade = 0) {
        this.id = parseInt(id) || Date.now();
        this.nome = nome;
        this.descricao = descricao;
        this.preco = Number(preco);
        this.quantidade = parseInt(quantidade) || 0;
    }
    
    
    setId(id) {
        this.id = parseInt(id) || Date.now();
    }
    
    setNome(nome) {
        this.nome = String(nome || "");
    }
    
    setDescricao(descricao) {
        this.descricao = String(descricao || "");
    }
    
    setPreco(preco) {
        this.preco = Number(preco) || 0;
    }
    
    setQuantidade(quantidade) {
        this.quantidade = parseInt(quantidade) || 0;
    }
    
    toJSON() {
        const { id, nome, descricao, preco, quantidade } = this;
        return { id, nome, descricao, preco, quantidade };
    }
    
    static fromRaw(raw) {
        if (!raw) return new Produtos();
        
        return new Produtos(
            raw.id,
            raw.nome,
            raw.descricao,
            raw.preco,
            raw.quantidade
        );
    }
}