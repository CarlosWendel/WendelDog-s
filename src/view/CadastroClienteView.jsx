import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Card, Text, Appbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { UsuarioDAO } from "../../src/service/dao/UsuarioDAO";

export default function CadastroClienteView({ navigation }) {
  const [cliente, setCliente] = useState({
    nome: "",
    email: "",
    celular: "",
    endereco: "",
    senha: "",
    admin: false,
  });
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastrar = async () => {
    
    if (!cliente.nome.trim() || !cliente.email.trim() || !cliente.senha.trim()) {
      Alert.alert("Atenção", "Nome, email e senha são obrigatórios!");
      return;
    }

    
    setLoading(true);
    
    try {
      const novoUsuario = await UsuarioDAO.create({ ...cliente, admin: false });
      
      if (novoUsuario) {
        Alert.alert(
          "Sucesso!", 
          "Cadastro realizado com sucesso! Faça login para continuar.",
          [
            { 
              text: "Fazer Login", 
              onPress: () => navigation.goBack() 
            }
          ]
        );
        
        setCliente({
          nome: "",
          email: "",
          celular: "",
          endereco: "",
          senha: "",
          admin: false,
        });
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      const mensagemErro = error.message || error.mensagem || "Erro ao cadastrar cliente";
      Alert.alert("Erro", mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Criar Conta" />
      </Appbar.Header>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>
                Cadastrar Cliente 🧾
              </Text>

              <TextInput
                mode="outlined"
                label="Nome *"
                value={cliente.nome}
                onChangeText={(t) => setCliente({ ...cliente, nome: t })}
                style={styles.input}
                disabled={loading}
                left={<TextInput.Icon icon="account" />}
                returnKeyType="next"
              />

              <TextInput
                mode="outlined"
                label="E-mail *"
                value={cliente.email}
                onChangeText={(t) => setCliente({ ...cliente, email: t })}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={loading}
                left={<TextInput.Icon icon="email" />}
                returnKeyType="next"
              />

              <TextInput
                mode="outlined"
                label="Celular"
                keyboardType="phone-pad"
                value={cliente.celular}
                onChangeText={(t) => setCliente({ ...cliente, celular: t })}
                style={styles.input}
                disabled={loading}
                left={<TextInput.Icon icon="phone" />}
                returnKeyType="next"
              />

              <TextInput
                mode="outlined"
                label="Endereço"
                value={cliente.endereco}
                onChangeText={(t) => setCliente({ ...cliente, endereco: t })}
                style={styles.input}
                disabled={loading}
                left={<TextInput.Icon icon="home" />}
                returnKeyType="next"
              />

              <TextInput
                mode="outlined"
                label="Senha *"
                secureTextEntry
                value={cliente.senha}
                onChangeText={(t) => setCliente({ ...cliente, senha: t })}
                style={styles.input}
                disabled={loading}
                left={<TextInput.Icon icon="lock" />}
                returnKeyType="done"
                onSubmitEditing={handleCadastrar}
              />

              <Button
                mode="contained"
                onPress={handleCadastrar}
                loading={loading}
                disabled={loading}
                style={styles.button}
                icon="account-plus"
              >
                {loading ? "Cadastrando..." : "Criar Conta"}
              </Button>

              <Button
                mode="text"
                onPress={() => !loading && navigation.goBack()}
                style={styles.backButton}
                icon="arrow-left"
                disabled={loading}
              >
                Voltar para o Login
              </Button>

              {mensagem ? (
                <Text style={[
                  styles.mensagem,
                  mensagem.includes("✅") ? styles.sucesso : styles.erro
                ]}>
                  {mensagem}
                </Text>
              ) : null}
            </Card.Content>
          </Card>

          
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoTitle}>Por que se cadastrar?</Text>
              <Text style={styles.infoText}>
                • Faça pedidos mais rápido{"\n"}
                • Acompanhe seus pedidos{"\n"}
                • Receba promoções exclusivas{"\n"}
             
              </Text>
            </Card.Content>
          </Card>

         
          <View style={styles.espacoFinal} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: { 
    flex: 1,
    padding: 16,
    minHeight: '100%',
  },
  card: {
    elevation: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoCard: {
    elevation: 2,
    borderRadius: 8,
    backgroundColor: '#e8f4fd',
    borderColor: '#3b82f6',
    borderWidth: 1,
    marginBottom: 16,
  },
  title: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 6,
  },
  backButton: {
    marginBottom: 16,
  },
  mensagem: {
    textAlign: "center",
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  sucesso: {
    backgroundColor: "#10b981",
    color: "#fff",
  },
  erro: {
    backgroundColor: "#ef4444",
    color: "#fff",
  },
  infoTitle: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
  espacoFinal: {
    height: 40, // Espaço extra no final para scroll confortável
  },
});