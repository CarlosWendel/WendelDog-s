import Produto from "../../model/Produtos";
import { getJSON, setJSON } from "../storage";

const PRODUTO_KEY = "@dogs/produto"; 

async function readAllRaw() {
    const arr = await getJSON(PRODUTO_KEY, []);
    return Array.isArray(arr) ? arr : [];
}

async function writeAllRaw(arr) {
    await setJSON(PRODUTO_KEY, arr);
}

export const ProdutoDAO = {
    async list() {
        const raw = await readAllRaw();
        if (!Array.isArray(raw)) {
            console.warn("⚠️ Dados de produto corrompidos, recriando lista vazia.");
            await writeAllRaw([]);
            return [];
        }
        return raw.map((p) => Produto.fromRaw(p));
    },

    async create(produto) {
        const raw = await readAllRaw();
        const id = Date.now();
        const novoProduto = new Produto(
            id,
            produto.nome,
            produto.descricao,
            produto.preco,
            produto.quantidade 
        );
        raw.push(novoProduto.toJSON());
        await writeAllRaw(raw);
        console.log("✅ Produto criado:", {
            nome: novoProduto.nome,
            id: novoProduto.id
        });
        return novoProduto;
    },

     async update(produto) {
        const raw = await readAllRaw();
        const index = raw.findIndex(p => p.id === produto.id);
        if (index !== -1) {
          
            const produtoAtualizado = new Produto(
                produto.id,
                produto.nome,
                produto.descricao,
                produto.preco,
                produto.quantidade || produto.estoque || 0
            );
            
            raw[index] = produtoAtualizado.toJSON();
            await writeAllRaw(raw);
            console.log("✅ Produto atualizado:", produtoAtualizado);
            return produtoAtualizado;
        }
        return null;
    },
    async delete(id) {
        const raw = await readAllRaw();
        const novaLista = raw.filter(p => p.id !== id);
        await writeAllRaw(novaLista);
        return true;
    },

    async seedIfEmpty() {
        const raw = await readAllRaw();
        if (raw.length > 0) return raw.map(p => Produto.fromRaw(p)); 
        
        const seed = [
            new Produto(1, "Hot Dog Clássico", "Pão, salsicha, batata palha, ketchup e maionese.", 12.90, 10).toJSON(),
            new Produto(2, "Hot Dog Duplo", "Dois hot dogs com queijo derretido e molho especial.", 16.50, 10).toJSON(), 
            new Produto(3, "WendelDo's Especial", "Dogão completo com bacon, queijo, milho e molho secreto.", 19.90, 10).toJSON(), 
        ];
        await writeAllRaw(seed);
        console.log("🌱 Produtos seed criados:", seed);
        return seed.map(p => Produto.fromRaw(p)); 
    },
};