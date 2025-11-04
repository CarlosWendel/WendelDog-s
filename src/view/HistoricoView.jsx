// src/view/HistoricoView.js
import { Appbar, Card, Text, Button, Divider } from "react-native-paper"
import { View, FlatList, Alert } from "react-native";
import { HistoricoController } from "../controller/HistoricoController";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../components/authoProvider/Authoprovider";

const HistoricoView = () => {
    const { user } = useAuth();
    const navigation = useNavigation();
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarHistorico();
    }, []);

    const carregarHistorico = async () => {
        try {
            setLoading(true);
            
            if (!user) {
                setHistorico([]);
                return;
            }

            const historicoAtual = await HistoricoController.getHistorico(user.id);
            setHistorico(historicoAtual);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar o histórico");
        } finally {
            setLoading(false);
        }
    }

    const formatarData = (dataString) => {
        try {
            const data = new Date(dataString);
            return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            return 'Data inválida';
        }
    }

    const handleLimparHistorico = () => {
        Alert.alert(
            "Limpar Histórico",
            "Tem certeza que deseja limpar todo o histórico de compras?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Limpar", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const resultado = await HistoricoController.limparHistorico();
                            if (resultado.success) {
                                setHistorico([]);
                                Alert.alert("Sucesso", "Histórico limpo!");
                            }
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível limpar o histórico");
                        }
                    }
                }
            ]
        );
    }

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.headerCompra}>
                    <Text variant="titleMedium" style={styles.dataCompra}>
                        {formatarData(item.data)}
                    </Text>
                    <Text variant="titleLarge" style={styles.valorTotal}>
                        R$ {item.valorTotal?.toFixed(2)}
                    </Text>
                </View>
                
                <Divider style={styles.divider} />
                
                {item.itens?.map((itemProduto, index) => (
                    <View key={index} style={styles.itemCompra}>
                        <View style={styles.infoProduto}>
                            <Text style={styles.nomeProduto}>
                                {itemProduto.produto?.nome || 'Produto não encontrado'}
                            </Text>
                            <Text style={styles.detalhesProduto}>
                                {itemProduto.quantidade} x R$ {itemProduto.produto?.preco?.toFixed(2) || '0.00'}
                            </Text>
                        </View>
                        <Text style={styles.subtotal}>
                            R$ {((itemProduto.produto?.preco || 0) * itemProduto.quantidade).toFixed(2)}
                        </Text>
                    </View>
                ))}
            </Card.Content>
        </Card>
    );

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Histórico de Compras" />
                {historico.length > 0 && (
                    <Appbar.Action 
                        icon="trash-can-outline" 
                        onPress={handleLimparHistorico} 
                    />
                )}
            </Appbar.Header>

            <View style={styles.container}>
                {loading ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Carregando...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={historico}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    Nenhuma compra realizada ainda
                                </Text>
                                <Button 
                                    mode="contained" 
                                    onPress={() => navigation.navigate('Carrinho')}
                                    style={styles.botaoComprar}
                                >
                                    Fazer Primeira Compra
                                </Button>
                            </View>
                        }
                        contentContainerStyle={historico.length === 0 && styles.emptyList}
                    />
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    card: {
        margin: 12,
        marginBottom: 8,
        elevation: 2,
    },
    headerCompra: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    dataCompra: {
        color: '#666',
        fontSize: 14,
    },
    valorTotal: {
        color: '#059669',
        fontWeight: 'bold',
    },
    divider: {
        marginVertical: 8,
    },
    itemCompra: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    infoProduto: {
        flex: 1,
    },
    nomeProduto: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    detalhesProduto: {
        fontSize: 14,
        color: '#6b7280',
    },
    subtotal: {
        fontSize: 16,
        color: '#374151',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyList: {
        flex: 1,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    botaoComprar: {
        marginTop: 8,
    },
});

export default HistoricoView;