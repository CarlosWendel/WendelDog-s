import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import HomeNav from './src/components/navigator/HomeNav';
import LoginView from './src/view/LoginView';
import SplashView from './src/view/SplashView';
import CadastroClienteView from './src/view/CadastroClienteView';
import { AuthProvider } from './src/components/authoProvider/Authoprovider';
import { UsuarioDAO } from './src/service/dao/UsuarioDAO';
import { useEffect } from 'react';

const RootStack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    UsuarioDAO.seedAdmin();
  }, []);
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Splash" component={SplashRoute} />
            <RootStack.Screen name="Login" component={LoginView} />
            <RootStack.Screen name="CadastroCliente" component={CadastroClienteView} />
            <RootStack.Screen name="AppTabs" component={HomeNav} />
          </RootStack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function SplashRoute({ navigation }) {
  return <SplashView onFinish={() => navigation.replace('Login')} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
