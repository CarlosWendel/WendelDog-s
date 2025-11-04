import { Text, Card, Button as PaperButton, Divider } from "react-native-paper";
import { StyleSheet, View, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/components/authoProvider/Authoprovider";
import { useNavigation } from "@react-navigation/native";


const PerfilView = () => {
  const { user, deslogar } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          deslogar();
          navigation.replace("Login");
        },
      },
    ]);
  };

  const handleVerHistorico = () => {
    navigation.navigate("Historico");
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
      
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={styles.nomeUsuario}>{user?.nome || 'Usuário'}</Text>
            <Text style={styles.emailUsuario}>{user?.email || 'E-mail não informado'}</Text>
          </Card.Content>
        </Card>

        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>📊 Informações da Conta</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nome:</Text>
              <Text style={styles.infoValue}>{user?.nome || 'Não informado'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>E-mail:</Text>
              <Text style={styles.infoValue}>{user?.email || 'Não informado'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ID do Usuário:</Text>
              <Text style={styles.infoValue}>{user?.id ? `#${user.id}` : 'Não disponível'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Data de Cadastro:</Text>
              <Text style={styles.infoValue}>
                {user?.dataCadastro ? new Date(user.dataCadastro).toLocaleDateString('pt-BR') : 'Não informada'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🚀 Ações</Text>
            <Divider style={styles.divider} />
            
            <PaperButton 
              mode="contained" 
              onPress={handleVerHistorico}
              style={styles.actionButton}
              icon="history"
            >
              Ver Histórico de Compras
            </PaperButton>
            
          
          </Card.Content>
        </Card>


      </ScrollView>

     
      <View style={styles.footer}>
        <PaperButton 
          mode="contained" 
          onPress={handleLogout}
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonText}
          icon="logout"
        >
          Sair da Conta
        </PaperButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, 
  },
  headerCard: {
    backgroundColor: "#3b82f6",
    marginBottom: 16,
  },
  headerContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  nomeUsuario: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emailUsuario: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: "#e5e7eb",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#6b7280",
  },
  actionButton: {
    marginVertical: 6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e7eb",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PerfilView;