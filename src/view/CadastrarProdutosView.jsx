import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, FlatList, Text } from "react-native";
import CadastroProdutoController from "../controller/CadastrarProdutoController";
import React, { useEffect, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Appbar, Card, Button, IconButton, TextInput, HelperText, Snackbar, ActivityIndicator } from "react-native-paper";

const CadatrarProdutosView = () => {
    const { state, actions } = CadastroProdutoController();
    const { lista, loading, editing, errors, snack } = state;
    const { load, startCreate, startEdit, cancelEdit, save, remove, setSnack } = actions;

    const insets = useSafeAreaInsets();
    const keyboardOffset = useMemo(() => insets.top + 56 + 56, [insets.top]);

    useEffect(() => {
        load();
    }, [load]);

    const handleFieldChange = (field, value) => {
        const updated = { ...editing, [field]: value };
        startEdit(updated);
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.descricao} numberOfLines={2}>
                    {item.descricao}
                </Text>
                <Text style={styles.preco}>R$ {item.preco?.toFixed(2)}</Text>
                <Text style={styles.codigo}>Cód: {item.id}</Text>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
                <Button 
                    mode="contained" 
                    onPress={() => startEdit(item)}
                    style={styles.botaoEditar}
                    icon="pencil"
                >
                    Editar
                </Button>

                <Button 
                    mode="outlined" 
                    onPress={() => remove(item.id)}
                    style={styles.botaoExcluir}
                    textColor="#ef4444"
                    icon="delete"
                >
                    Excluir
                </Button>
            </Card.Actions>
        </Card>
    );

    const listaParaRenderizar = lista && lista.length > 0 ? lista : [];

    return (
        <View style={styles.root}>
            <Appbar.Header>
                <Appbar.Content title="Gerenciar Produtos" />
                {!editing && <Appbar.Action icon="plus" onPress={startCreate} />}
                {editing && <Appbar.Action icon="close" onPress={cancelEdit} />}
            </Appbar.Header>

            {!editing && (
                <View style={styles.container}>
                    {loading ? (
                        <View style={styles.center}>
                            <ActivityIndicator color="#3b82f6" size="large" />
                            <Text style={styles.loadingText}>Carregando produtos...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={listaParaRenderizar} 
                            keyExtractor={(it) => String(it.id)}
                            renderItem={renderItem}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Sem produtos cadastrados.</Text>
                                    <Button 
                                        mode="contained" 
                                        onPress={startCreate}
                                        style={{ marginTop: 12 }}
                                        icon="plus"
                                    >
                                        Criar Primeiro Produto
                                    </Button>
                                </View>
                            }
                            contentContainerStyle={styles.listaContainer}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            )}

            {editing && (
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={keyboardOffset}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Card style={styles.formCard}>
                            <Card.Content>
                                <Text style={styles.formTitle}>Dados do Produto</Text>

                                <TextInput
                                    label="Nome do produto *"
                                    mode="outlined"
                                    value={editing.nome || ''}
                                    onChangeText={(v) => handleFieldChange('nome', v)}
                                    error={!!errors.nome}
                                    style={styles.input}
                                />
                                <HelperText type="error" visible={!!errors.nome}>
                                    {errors.nome}
                                </HelperText>

                                <TextInput
                                    label="Descrição"
                                    mode="outlined"
                                    value={editing.descricao || ''}
                                    onChangeText={(v) => handleFieldChange('descricao', v)}
                                    multiline
                                    numberOfLines={3}
                                    style={styles.input}
                                />

                                <TextInput
                                    label="Preço R$ *"
                                    mode="outlined"
                                    value={editing.preco ? String(editing.preco) : ''}
                                    onChangeText={(v) => handleFieldChange('preco', v)}
                                    keyboardType="decimal-pad"
                                    error={!!errors.preco}
                                    style={styles.input}
                                    left={<TextInput.Icon icon="currency-brl" />}
                                />
                                <HelperText type="error" visible={!!errors.preco}>
                                    {errors.preco}
                                </HelperText>

                                <View style={styles.botoesContainer}>
                                    <Button 
                                        mode="outlined" 
                                        onPress={cancelEdit} 
                                        style={styles.botaoCancelar}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        mode="contained" 
                                        onPress={() => save(editing)} 
                                        style={styles.botaoSalvar}
                                        loading={loading}
                                        icon="content-save"
                                    >
                                        Salvar
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}

            <Snackbar 
                visible={snack?.visible} 
                onDismiss={() => setSnack({ ...snack, visible: false })}
                duration={3000}
                style={styles.snackbar}
                action={{
                    label: 'OK',
                    onPress: () => setSnack({ ...snack, visible: false }),
                }}
            >
                {snack?.msg}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    container: { 
        flex: 1, 
        padding: 16, 
        backgroundColor: '#f5f5f5' 
    },
    listaContainer: {
        paddingBottom: 20,
    },
    center: { 
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center" 
    },
    card: {
        marginBottom: 0,
        elevation: 2,
        borderRadius: 8,
    },
    nome: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 6,
    },
    descricao: {
        color: '#666',
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
    },
    preco: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    codigo: {
        color: '#999',
        fontSize: 12,
        fontStyle: 'italic',
    },
    cardActions: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    botaoEditar: {
        flex: 1,
        marginRight: 8,
    },
    botaoExcluir: {
        flex: 1,
        marginLeft: 8,
        borderColor: '#ef4444',
    },
    formCard: {
        elevation: 4,
        borderRadius: 8,
        marginBottom: 20,
    },
    formTitle: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    botoesContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    botaoCancelar: {
        flex: 1,
    },
    botaoSalvar: {
        flex: 1,
    },
    loadingText: {
        color: '#666',
        marginTop: 12,
        fontSize: 16,
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
        marginBottom: 12,
    },
    snackbar: {
        backgroundColor: '#323232',
        marginBottom: 20,
    }
});

export default CadatrarProdutosView;