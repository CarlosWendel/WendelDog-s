import { Appbar, Card, Text, Button, IconButton } from "react-native-paper"
import { View, FlatList, Alert } from "react-native";
import { CarrinhoController } from "../controller/CarrinhoController";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HistoricoController } from "../controller/HistoricoController";
import { useAuth } from "../components/authoProvider/Authoprovider";

const CarrinhoView = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [carrinho, setCarrinho] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            carregarCarrinho();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        carregarCarrinho();
    }, []);

    const carregarCarrinho = async () => {
        try {
            setLoading(true);
            const carrinhoAtual = await CarrinhoController.getCarrinho();
            setCarrinho(carrinhoAtual);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar o carrinho");
        } finally {
            setLoading(false);
        }
    }

    const handleRemoverItem = async (produtoId) => {
        try {
            const resultado = await CarrinhoController.removerDoCarrinho(produtoId);
            if (resultado.success) {
                setCarrinho(resultado.carrinho);
                Alert.alert("Sucesso", "Produto removido do carrinho!");
            } else {
                Alert.alert("Erro", resultado.message);
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível remover o produto");
        }
    }

    const handleAtualizarQuantidade = async (produtoId, novaQuantidade) => {
        if (novaQuantidade < 1) {
            handleRemoverItem(produtoId);
            return;
        }

        try {
            const resultado = await CarrinhoController.atualizarQuantidade(produtoId, novaQuantidade);
            if (resultado.success) {
                setCarrinho(resultado.carrinho);
            } else {
                Alert.alert("Erro", resultado.message);
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível atualizar a quantidade");
        }
    }

    const handleLimparCarrinho = async () => {
        Alert.alert(
            "Limpar Carrinho",
            "Tem certeza que deseja remover todos os itens do carrinho?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Limpar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const resultado = await CarrinhoController.limparCarrinho();
                            if (resultado.success) {
                                setCarrinho(resultado.carrinho);
                                Alert.alert("Sucesso", "Carrinho limpo!");
                            }
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível limpar o carrinho");
                        }
                    }
                }
            ]
        );
    }

    const handleFinalizarCompra = async () => {
        if (!user) {
            Alert.alert('Erro', 'Você precisa estar logado para finalizar a compra');
            navigation.navigate('Login');
            return;
        }
        
        if (!carrinho || carrinho.itens.length === 0) {
            Alert.alert("Carrinho Vazio", "Adicione produtos ao carrinho antes de finalizar a compra");
            return;
        }

        Alert.alert(
            "Finalizar Compra",
            `Total: R$ ${carrinho.valorTotal.toFixed(2)}\nDeseja finalizar a compra?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Finalizar",
                    onPress: async () => {
                        try {
                            const resultado = await HistoricoController.registrarCompra(carrinho, user.id);
                            
                            if (resultado.success) {
                                Alert.alert("✅ Sucesso", "Compra finalizada e salva no histórico!");
                                await handleLimparCarrinho();
                            } else {
                                Alert.alert("❌ Erro", resultado.message);
                            }
                        } catch (error) {
                            Alert.alert("❌ Erro", "Erro ao finalizar a compra");
                        }
                    }
                }
            ]
        );
    }

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.itemHeader}>
                    <Text variant="titleMedium" style={styles.nomeProduto}>
                        {item.produto.nome}
                    </Text>
                    <IconButton
                        icon="close"
                        size={20}
                        onPress={() => handleRemoverItem(item.produto.id)}
                        style={styles.botaoRemover}
                    />
                </View>

                <Text variant="bodyMedium" style={styles.descricaoProduto}>
                    {item.produto.descricao}
                </Text>

                <View style={styles.itemFooter}>
                    <View style={styles.quantidadeContainer}>
                        <IconButton
                            icon="minus"
                            size={16}
                            mode="contained"
                            onPress={() => handleAtualizarQuantidade(item.produto.id, item.quantidade - 1)}
                            style={styles.botaoQuantidade}
                        />

                        <Text style={styles.quantidadeText}>
                            {item.quantidade}
                        </Text>

                        <IconButton
                            icon="plus"
                            size={16}
                            mode="contained"
                            onPress={() => handleAtualizarQuantidade(item.produto.id, item.quantidade + 1)}
                            style={styles.botaoQuantidade}
                        />
                    </View>

                    <Text variant="titleMedium" style={styles.precoItem}>
                        R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                    </Text>
                </View>

                <Text variant="bodySmall" style={styles.precoUnitario}>
                    R$ {item.produto.preco.toFixed(2)} cada
                </Text>
            </Card.Content>
        </Card>
    );

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Meu Carrinho" />
                {carrinho?.itens.length > 0 && (
                    <Appbar.Action
                        icon="trash-can-outline"
                        onPress={handleLimparCarrinho}
                    />
                )}
            </Appbar.Header>

            <View style={styles.container}>
                {loading ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Carregando...</Text>
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={carrinho?.itens || []}
                            keyExtractor={(item) => String(item.produto.id)}
                            renderItem={renderItem}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
                                        Seu carrinho está vazio
                                    </Text>
                                    <Button
                                        mode="contained"
                                        onPress={() => navigation.navigate('Loja')}
                                        style={styles.botaoComprar}
                                    >
                                        Continuar Comprando
                                    </Button>
                                </View>
                            }
                            contentContainerStyle={carrinho?.itens.length === 0 && styles.emptyList}
                        />

                        {carrinho?.itens.length > 0 && (
                            <View style={styles.resumoContainer}>
                                <View style={styles.resumoLine}>
                                    <Text style={styles.resumoLabel}>Quantidade Total:</Text>
                                    <Text style={styles.resumoValue}>{carrinho.quantidadeTotal} itens</Text>
                                </View>

                                <View style={styles.resumoLine}>
                                    <Text style={styles.resumoLabel}>Valor Total:</Text>
                                    <Text style={styles.resumoTotal}>
                                        R$ {carrinho.valorTotal.toFixed(2)}
                                    </Text>
                                </View>

                                <Button
                                    mode="contained"
                                    onPress={handleFinalizarCompra}
                                    style={styles.botaoFinalizar}
                                    contentStyle={styles.botaoFinalizarContent}
                                >
                                    Finalizar Compra
                                </Button>
                            </View>
                        )}
                    </>
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
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    nomeProduto: {
        color: '#000',
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    botaoRemover: {
        margin: 0,
        marginTop: -8,
        marginRight: -8,
    },
    descricaoProduto: {
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    quantidadeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    botaoQuantidade: {
        margin: 0,
        backgroundColor: '#3b82f6',
    },
    quantidadeText: {
        marginHorizontal: 12,
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 20,
        textAlign: 'center',
    },
    precoItem: {
        color: '#3b82f6',
        fontWeight: 'bold',
    },
    precoUnitario: {
        color: '#999',
        textAlign: 'right',
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
    resumoContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    resumoLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    resumoLabel: {
        fontSize: 16,
        color: '#666',
    },
    resumoValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    resumoTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    botaoFinalizar: {
        marginTop: 16,
    },
    botaoFinalizarContent: {
        paddingVertical: 8,
    },
});

export default CarrinhoView;