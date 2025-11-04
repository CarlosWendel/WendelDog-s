import Carrinho from "../../model/Carrinho.js";
import { getJSON, setJSON } from "../storage.js";

const CARRINHO_KEY = "@dogs/carrinho";

async function getCarrinho() {
    const raw = await getJSON(CARRINHO_KEY, null);
    return raw ? Carrinho.fromRaw(raw) : new Carrinho();
}

async function saveCarrinho(carrinho) {
    await setJSON(CARRINHO_KEY, carrinho.toJSON());
}

export const CarrinhoDAO = {
    async list() {
        const carrinho = await getCarrinho();
        return carrinho;
    },
    
    async get() {
        return await getCarrinho();
    },

    async save(carrinho) {
        await saveCarrinho(carrinho);
        return carrinho;
    },

    async adicionarItem(produto, quantidade = 1) {
        const carrinho = await getCarrinho();

        const itemExistente = carrinho.itens.find(item => item.produto.id === produto.id);
        if (itemExistente) {
            itemExistente.quantidade += parseInt(quantidade);
        } else {
            carrinho.itens.push({ produto: produto, quantidade: parseInt(quantidade) });
        }
        carrinho.quantidadeTotal = carrinho.itens.reduce((sum, item) => sum + item.quantidade, 0);
        carrinho.valorTotal = carrinho.itens.reduce((sum, item) => sum + (item.produto.preco * item.quantidade), 0);

        await saveCarrinho(carrinho);
        return carrinho;
    },

    
    async atualizarQuantidadeItem(produtoId, novaQuantidade) {
        const carrinho = await getCarrinho();
        const item = carrinho.itens.find(item => item.produto.id === produtoId);

        if (item) {
            item.quantidade = parseInt(novaQuantidade);
            carrinho.quantidadeTotal = carrinho.itens.reduce((sum, item) => sum + item.quantidade, 0);
            carrinho.valorTotal = carrinho.itens.reduce((sum, item) => sum + (item.produto.preco * item.quantidade), 0);
            await saveCarrinho(carrinho);
        }
        return carrinho;
    },

    async removerItem(produtoId) {
        const carrinho = await getCarrinho();
        carrinho.itens = carrinho.itens.filter(item => item.produto.id !== produtoId);
        carrinho.quantidadeTotal = carrinho.itens.reduce((sum, item) => sum + item.quantidade, 0);
        carrinho.valorTotal = carrinho.itens.reduce((sum, item) => sum + (item.produto.preco * item.quantidade), 0);
        await saveCarrinho(carrinho);
        return carrinho;
    },

    async limpar() {
        const carrinhoVazio = new Carrinho();
        await saveCarrinho(carrinhoVazio);
        return carrinhoVazio;
    }
};