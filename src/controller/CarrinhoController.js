import { CarrinhoDAO } from '../../src/service/dao/CarrinhoDAO';

export const CarrinhoController = {
    async adicionarAoCarrinho(produto, quantidade = 1) {
        try {
            const carrinhoAtualizado = await CarrinhoDAO.adicionarItem(produto, quantidade);

            console.log('✅ Produto adicionado ao carrinho:', produto.nome);

            return {
                success: true,
                carrinho: carrinhoAtualizado,
                message: 'Produto adicionado ao carrinho!'
            };

        } catch (error) {
            console.error('❌ Erro ao adicionar ao carrinho:', error);
            return {
                success: false,
                message: 'Erro ao adicionar produto ao carrinho'
            };
        }
    },

    async removerDoCarrinho(produtoId) {
        try {
            const carrinhoAtualizado = await CarrinhoDAO.removerItem(produtoId);
            return {
                success: true,
                carrinho: carrinhoAtualizado,
                message: 'Produto removido do carrinho!'
            };
        } catch (error) {
            console.error('❌ Erro ao remover do carrinho:', error);
            return {
                success: false,
                message: 'Erro ao remover produto do carrinho'
            };
        }
    },

    async getCarrinho() {
        try {
            return await CarrinhoDAO.get();
        } catch (error) {
            console.error('❌ Erro ao buscar carrinho:', error);
            return new Carrinho();
        }
    },


    async atualizarQuantidade(produtoId, novaQuantidade) {
        try {
            const carrinhoAtualizado = await CarrinhoDAO.atualizarQuantidadeItem(produtoId, novaQuantidade);
            return {
                success: true,
                carrinho: carrinhoAtualizado,
                message: 'Quantidade atualizada!'
            };
        } catch (error) {
            console.error('❌ Erro ao atualizar quantidade:', error);
            return {
                success: false,
                message: 'Erro ao atualizar quantidade'
            };
        }
    },


    async limparCarrinho() {
        try {
            const carrinhoVazio = await CarrinhoDAO.limpar();
            return {
                success: true,
                carrinho: carrinhoVazio,
                message: 'Carrinho limpo!'
            };
        } catch (error) {
            console.error('❌ Erro ao limpar carrinho:', error);
            return {
                success: false,
                message: 'Erro ao limpar carrinho'
            };
        }
    },
    async finalizarCompra(carrinho) {
        try {

            const resultadoHistorico = await HistoricoController.registrarCompra(carrinho);

            if (!resultadoHistorico.success) {
                return resultadoHistorico;
            }


            const carrinhoVazio = await CarrinhoDAO.limpar();

            return {
                success: true,
                compra: resultadoHistorico.compra,
                message: 'Compra finalizada com sucesso!'
            };

        } catch (error) {
            console.error('❌ Erro ao finalizar compra:', error);
            return {
                success: false,
                message: 'Erro ao finalizar compra'
            };
        };
    }
};