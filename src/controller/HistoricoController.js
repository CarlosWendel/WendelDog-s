
import { HistoricoDAO } from '../service/dao/HistoricoDAO';

export const HistoricoController = {
    async registrarCompra(carrinho, usuarioId) {
        try {
            const compraRegistrada = await HistoricoDAO.adicionarCompra(carrinho, usuarioId);
            
            return {
                success: true,
                compra: compraRegistrada,
                message: 'Compra registrada no histórico!'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erro ao registrar compra no histórico'
            };
        }
    },

    async getHistorico(usuarioId) {
        try {
            return await HistoricoDAO.list(usuarioId);
        } catch (error) {
            return [];
        }
    },

    async limparHistorico() {
        try {
            
          await HistoricoDAO.limparHistorico();
            
            return {
                success: true,
                message: 'Histórico limpo com sucesso!'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erro ao limpar histórico'
            };
        }
    }
};