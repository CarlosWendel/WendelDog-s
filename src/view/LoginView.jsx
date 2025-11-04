import React, { useEffect, useState } from "react";
import { Button, Card, Snackbar, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Keyboard,
  View,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useAuth } from "../components/authoProvider/Authoprovider";

const LoginView = ({ navigation }) => {
  const [showPass, setShowPass] = useState(true);
  const [campos, setCampos] = useState({ email: "", senha: "" });
  const [showSnack, setShowSnack] = useState({ 
    show: false, 
    message: "Login ou senha incorreta." 
  });
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setShowSnack({ ...showSnack, show: false });
    }, 4000);
    return () => clearTimeout(id);
  }, [showSnack]);

  useEffect(() => {
    if (user) {
      navigation.replace("AppTabs");
    }
  }, [user, navigation]);

  const handleLogin = async () => {
    if (!campos.email.trim() || !campos.senha.trim()) {
      setShowSnack({ 
        show: true, 
        message: "Por favor, preencha email e senha." 
      });
      return;
    }

    setLoading(true);
    
    try {
      const success = await login(campos.email, campos.senha);
      
      if (success) {
        console.log("👤 Login realizado com sucesso!");
      } else {
        setCampos({ email: "", senha: "" });
        setShowSnack({ 
          show: true, 
          message: "Email ou senha incorretos." 
        });
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setCampos({ email: "", senha: "" });
      setShowSnack({ 
        show: true, 
        message: "Erro ao fazer login. Tente novamente." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      
      <View style={styles.background}>
        <View style={styles.gradientOverlay} />
        <View style={styles.floatingCircles}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>
      </View>

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <View style={styles.centerBox}>
            
           
            <Animated.View 
              style={[
                styles.logoWrapper,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                  resizeMode="cover"
                />
                <View style={styles.logoGlow} />
              </View>
              <Text style={styles.appName}>WendelDo's</Text>
              <Text style={styles.appSlogan}>Sabor que conquista! 🌭</Text>
            </Animated.View>

            
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }}
            >
              <Card style={styles.card} mode="elevated">
                <Card.Content>
                  <Text variant="headlineMedium" style={styles.title}>
                    Bem-vindo de volta! 👋
                  </Text>
                  <Text variant="bodyMedium" style={styles.subtitle}>
                    Faça login para continuar sua experiência
                  </Text>

                  <TextInput
                    mode="outlined"
                    label="E-mail"
                    left={<TextInput.Icon icon="email" color="#94a3b8" />}
                    value={campos.email}
                    onChangeText={(e) => setCampos({ ...campos, email: e })}
                    style={styles.input}
                    keyboardType="email-address"
                    textColor="#fff"
                    autoCapitalize="none"
                    disabled={loading}
                    theme={{
                      colors: {
                        primary: '#3b82f6',
                        background: 'transparent',
                        text: '#fff',
                        placeholder: '#94a3b8'
                      }
                    }}
                  />

                  <TextInput
                    mode="outlined"
                    label="Senha"
                    secureTextEntry={showPass}
                    value={campos.senha}
                    onChangeText={(e) => setCampos({ ...campos, senha: e })}
                    left={<TextInput.Icon icon="lock" color="#94a3b8" />}
                    right={
                      <TextInput.Icon
                        icon={showPass ? "eye-off" : "eye"}
                        color="#94a3b8"
                        onPress={() => setShowPass(!showPass)}
                      />
                    }
                    style={styles.input}
                    textColor="#fff"
                    disabled={loading}
                    theme={{
                      colors: {
                        primary: '#3b82f6',
                        background: 'transparent',
                        text: '#fff',
                        placeholder: '#94a3b8'
                      }
                    }}
                  />

                  <Button 
                    mode="contained" 
                    onPress={handleLogin} 
                    style={styles.button}
                    loading={loading}
                    disabled={loading}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    icon="login"
                  >
                    {loading ? "Entrando..." : "Entrar na Conta"}
                  </Button>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <Pressable 
                    onPress={() => !loading && navigation.navigate("CadastroCliente")}
                    disabled={loading}
                    style={({ pressed }) => [
                      styles.signupButton,
                      pressed && styles.signupButtonPressed
                    ]}
                  >
                    <Text style={[
                      styles.signupText,
                      loading && { opacity: 0.5 }
                    ]}>
                      Não tem uma conta? <Text style={styles.signupHighlight}>Crie uma agora</Text>
                    </Text>
                  </Pressable>
                </Card.Content>
              </Card>
            </Animated.View>

            
            <Animated.View 
              style={[
                styles.footer,
                { opacity: fadeAnim }
              ]}
            >
              <Text style={styles.footerText}>
                © 2025 WendelDo's • Todos os direitos reservados
              </Text>
            </Animated.View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>

      <Snackbar
        visible={showSnack.show}
        onDismiss={() => setShowSnack({ ...showSnack, show: false })}
        duration={4000}
        style={styles.snackbar}
        action={{
          label: 'OK',
          textColor: '#3b82f6',
        }}
      >
        {showSnack.message}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0f172a" 
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0f172a',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },
  floatingCircles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 500,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: 200,
    right: 50,
  },
  centerBox: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 24 
  },
  logoWrapper: { 
    alignItems: "center", 
    marginBottom: 30 
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: "rgba(59, 130, 246, 0.3)",
    overflow: "hidden",
  },
  logoGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 999,
    zIndex: -1,
  },
  appName: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(59, 130, 246, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  appSlogan: {
    color: '#cbd5e1',
    fontSize: 14,
    fontStyle: 'italic',
  },
  card: { 
    backgroundColor: "rgba(30, 41, 59, 0.8)", 
    borderRadius: 20, 
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: { 
    textAlign: "center", 
    color: "#f8fafc", 
    marginBottom: 6,
    fontWeight: 'bold',
  },
  subtitle: { 
    textAlign: "center", 
    color: "#cbd5e1", 
    marginBottom: 24,
    fontSize: 14,
  },
  input: { 
    marginBottom: 16, 
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: { 
    marginTop: 8, 
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#94a3b8',
    paddingHorizontal: 12,
    fontSize: 12,
  },
  signupButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signupButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  signupText: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
  },
  signupHighlight: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
  },
  snackbar: {
    backgroundColor: '#1e293b',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 20,
  },
});

export default LoginView;