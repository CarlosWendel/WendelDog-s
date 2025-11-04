// src/service/dao/HistoricoDAO.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HistoricoDAO = {
    async adicionarCompra(carrinho, usuarioId) {
        try {
            const historico = await AsyncStorage.getItem('historico_compras');
            const historicoArray = historico ? JSON.parse(historico) : [];
            
            const novaCompra = {
                id: Date.now(),
                usuarioId: usuarioId,
                data: new Date().toISOString(),
                itens: carrinho.itens,
                valorTotal: carrinho.valorTotal,
                quantidadeTotal: carrinho.quantidadeTotal
            };
            
            historicoArray.push(novaCompra);
            await AsyncStorage.setItem('historico_compras', JSON.stringify(historicoArray));
            
            return novaCompra;
        } catch (error) {
            throw error;
        }
    },

    async list(usuarioId) {
        try {
            const historico = await AsyncStorage.getItem('historico_compras');
            const historicoArray = historico ? JSON.parse(historico) : [];
            
            const historicoFiltrado = historicoArray.filter(compra => compra.usuarioId === usuarioId);
            
            return historicoFiltrado;
        } catch (error) {
            return [];
        }
    },
     async limparHistorico() {
        try {
            await AsyncStorage.removeItem('historico_compras');
            return { success: true };
        } catch (error) {
            throw error;
        }
    }
};