import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Animated, Easing } from "react-native";
import { TextInput, Button, Card, Text, Checkbox, Snackbar, Appbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { UsuarioDAO } from "../../src/service/dao/UsuarioDAO";

export default function CadastrarUsuarioAdmin({ navigation }) {
  const [cliente, setCliente] = useState({
    nome: "",
    email: "",
    celular: "",
    endereco: "",
    senha: "",
    admin: false,
  });
  const [mensagem, setMensagem] = useState("");
  const [showSnack, setShowSnack] = useState(false);
  const [loading, setLoading] = useState(false);


  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleCadastrar = async () => {
   
    if (!cliente.nome.trim() || !cliente.email.trim() || !cliente.senha.trim()) {
      setMensagem("❌ Nome, email e senha são obrigatórios!");
      setShowSnack(true);
      return;
    }

   // if (cliente.senha.length < 6) {
    //  setMensagem("❌ A senha deve ter pelo menos 6 caracteres!");
    //  setShowSnack(true);
    //  return;
   // }

    setLoading(true);
    
    try {
      const novo = await UsuarioDAO.create(cliente);
      setMensagem("✅ Usuário cadastrado com sucesso!");
      setShowSnack(true);
      
     
      setCliente({
        nome: "",
        email: "",
        celular: "",
        endereco: "",
        senha: "",
        admin: false,
      });
      
    } catch (error) {
      setMensagem(error.message || "❌ Erro ao cadastrar usuário.");
      setShowSnack(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Cadastrar Usuário" />
      </Appbar.Header>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.title}>
                Cadastrar Usuário 🧾
              </Text>
              <Text style={styles.subtitle}>
                Preencha os dados do novo usuário
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
              />

              
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={cliente.admin ? "checked" : "unchecked"}
                  onPress={() => setCliente({ ...cliente, admin: !cliente.admin })}
                  color="#3b82f6"
                  disabled={loading}
                />
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxLabel}>
                    {cliente.admin ? "Administrador" : "Cliente"}
                  </Text>
                  <Text style={styles.checkboxDescription}>
                    {cliente.admin
                      ? "Terá acesso completo ao sistema"
                      : "Acesso limitado às funcionalidades"}
                  </Text>
                </View>
              </View>

              <Button 
                mode="contained" 
                onPress={handleCadastrar}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon="account-plus"
              >
                {loading ? "Cadastrando..." : "Cadastrar Usuário"}
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
        </Animated.View>
      </ScrollView>

      <Snackbar
        visible={showSnack}
        onDismiss={() => setShowSnack(false)}
        duration={3000}
        style={styles.snackbar}
        action={{
          label: 'OK',
          textColor: '#3b82f6',
        }}
      >
        {mensagem}
      </Snackbar>
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
    padding: 16,
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    flex: 1,
    elevation: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    minHeight: 600, 
  },
  cardContent: {
    flex: 1,
    paddingVertical: 8,
  },
  title: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  checkboxTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  checkboxLabel: { 
    color: "#000", 
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  checkboxDescription: {
    color: "#666",
    fontSize: 14,
    lineHeight: 18,
  },
  button: { 
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mensagem: {
    textAlign: "center",
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  sucesso: {
    backgroundColor: "#10b98110",
    color: "#10b981",
    borderWidth: 1,
    borderColor: "#10b98130",
  },
  erro: {
    backgroundColor: "#ef444410",
    color: "#ef4444",
    borderWidth: 1,
    borderColor: "#ef444430",
  },
  snackbar: {
    backgroundColor: '#1e293b',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 20,
  },
});