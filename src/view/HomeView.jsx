import { Appbar, Card, Text, Button } from "react-native-paper"
import { View, FlatList, TextInput } from "react-native";
import { CarrinhoController } from "../controller/CarrinhoController";
import { use, useState } from "react";
import { ProdutoDAO } from "../service/dao/ProdutoDAO";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";



const HomeView = () => {
    const navigation = useNavigation();
    const [busca, setBusca] = useState("");
   const [produtos, setProdutos] = useState([]);
   const [loading, setLoading] = useState(false);


   useEffect(() => {
    const unsubcribe = navigation.addListener('focus', () => {
    carregarProdutos();
   });
    return unsubcribe;
    }, [navigator]);

    useEffect(() => {
    carregarProdutos();
   }, []);

   const carregarProdutos = async () => {

    try {
        const lista = await ProdutoDAO.seedIfEmpty();
        setProdutos(lista);
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }finally {
        setCarregando(false);
    }
   }

   const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
    produto.descricao.toLowerCase().includes(busca.toLowerCase())
   );

    const handleAdicionarCarrinho = async (produto) => {
        try {
            const resultado = await CarrinhoController.adicionarAoCarrinho(produto, 1);
            if (resultado.success) {
                alert("Produto adicionado ao carrinho!");
            } else {
                alert("Erro ao adicionar produto ao carrinho: " + resultado.message);
            }
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            alert("Erro ao adicionar produto ao carrinho.");
        }
    }


   

    return (
           <>
            <Appbar.Header>
                <Appbar.Content title="WendelDo's" />
            </Appbar.Header>

            <View style={styles.container}>
                <TextInput
                    mode="outlined"
                    label="Buscar produto..."
                    value={busca}
                    onChangeText={setBusca}
                    style={styles.buscaInput}
                />
                
                <FlatList
                    data={produtosFiltrados}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                         
                            
                            <Card.Content>
                                <Text variant="titleLarge" style={styles.nome}>
                                    {item.nome}
                                </Text>
                                <Text variant="bodyMedium" style={styles.descricao} numberOfLines={2}>
                                    {item.descricao}
                                </Text>
                                <Text variant="titleMedium" style={styles.preco}>
                                    R$ {item.preco?.toFixed(2)}
                                </Text>
                            </Card.Content>

                            <Card.Actions style={styles.cardActions}>
                                <Button 
                                    mode="contained" 
                                    onPress={() => handleAdicionarCarrinho(item)}
                                    style={styles.botaoAdicionar}
                                >
                                    Adicionar
                                </Button>

                            </Card.Actions>
                        </Card>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {loading ? "Carregando..." : "Nenhum produto encontrado"}
                            </Text>
                        </View>
                    }
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16, 
        backgroundColor: '#f5f5f5' 
    },
    buscaInput: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    card: {
        marginBottom: 12,
        elevation: 2,
    },
    nome: {
        color: '#000',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    descricao: {
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    preco: {
        color: '#3b82f6',
        fontWeight: 'bold',
    },
    cardActions: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    botaoAdicionar: {
        flex: 1,
        marginRight: 8,
    },
    botaoInfo: {
        flex: 1,
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default HomeView;