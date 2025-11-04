
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import HomeView from '../../view/HomeView'
import PerfilView from '../../view/PerfilView';
import { useAuth } from '../authoProvider/Authoprovider';
import CarrinhoView from '../../view/CarrinhoView';
import InforView from '../../view/InfoView';
import CadatrarProdutos from '../../view/CadastrarProdutosView';
import CadastrarAdmin from '../../view/CadastrarUsuarioAdmin';
import HistoricoView from '../../view/HistoricoView'


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LojaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#101826' },
        headerTitleStyle: { color: '#E2E8F0' },
        headerTintColor: '#E2E8F0',
      }}
    >
      <Stack.Screen name="HomeView" component={HomeView} options={{ title: 'Loja' }} />

    </Stack.Navigator>
  );
}

function CarrinhoStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#101826" },
        headerTitleStyle: { color: "#E2E8F0" },
        headerTintColor: "#E2E8F0",
      }}
    >
      <Stack.Screen name="CarrinhoHome" component={CarrinhoView} options={{ title: "Carrinho" }} />

    </Stack.Navigator>
  );
}

function CadastrarProdutoStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#101826' },
        headerTitleStyle: { color: '#E2E8F0' },
        headerTintColor: '#E2E8F0',
      }}
    >
      <Stack.Screen name="Cadastrar" component={CadatrarProdutos} options={{ title: 'Minha Conta' }} />
    </Stack.Navigator>
  )
}

function CadastrarUsuarioAdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#101826" },
        headerTitleStyle: { color: "#E2E8F0" },
        headerTintColor: "#E2E8F0",
      }}
    >
      <Stack.Screen name="Cadastrar Usuario" component={CadastrarAdmin} />

    </Stack.Navigator>
  );
}

function InfoSatck() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#101826" },
        headerTitleStyle: { color: "#E2E8F0" },
        headerTintColor: "#E2E8F0",
      }}
    >
      <Stack.Screen name="InformaçãoView" component={InforView} options={{ title: "Info" }} />

    </Stack.Navigator>
  );
}

function ContaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#101826' },
        headerTitleStyle: { color: '#E2E8F0' },
        headerTintColor: '#E2E8F0',
      }}
    >
      <Stack.Screen name="PerfilView" component={PerfilView} options={{ title: 'Minha Conta' }} />
      <Stack.Screen 
        name="Historico" 
        component={HistoricoView} 
        options={{ 
          title: 'Histórico de Compras',
          headerStyle: { backgroundColor: '#101826' },
          headerTitleStyle: { color: '#E2E8F0' },
          headerTintColor: '#E2E8F0',
        }} 
      />
    </Stack.Navigator>
  );
}





const HomeNav = () => {
const { user, loading } = useAuth();
  
  if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}


if (!user) {
  return null; 
}

  return (
   <Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarStyle: { backgroundColor: '#101826', borderTopColor: '#1E293B' },
    tabBarActiveTintColor: '#fff',
    tabBarInactiveTintColor: '#94A3B8',
    tabBarIcon: ({ color, size }) => {
      const iconMap = {
        Loja: 'store',
        Conta: 'account-circle-outline',
        Carrinho: 'cart-outline',
        Informação: 'information-outline',
        Cadastrar: 'plus-box-outline',
        CadastrarUsuario: 'account-plus-outline',
       
      };
      return <MaterialCommunityIcons name={iconMap[route.name] || 'circle'} size={size} color={color} />;
    },
  })}
>
  <Tab.Screen name="Loja" component={LojaStack} />
  <Tab.Screen name="Carrinho" component={CarrinhoStack} />
   
  {user?.tipo === 'cliente' && (
    <Tab.Screen name="Informação" component={InfoSatck} />
  )}
  {user?.tipo === 'admin' && (
    <>
      <Tab.Screen name="Cadastrar" component={CadastrarProdutoStack} />
      <Tab.Screen name="CadastrarUsuario" component={CadastrarUsuarioAdminStack} />
    </>
  )}
  <Tab.Screen name="Conta" component={ContaStack} />
  
</Tab.Navigator>

  );

}

export default HomeNav
