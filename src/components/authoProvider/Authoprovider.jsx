import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsuarioDAO } from '../../service/dao/UsuarioDAO';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const data = await AsyncStorage.getItem('@dogs/usuario_logado');
        
        if (data) {
          try {
            const parsed = JSON.parse(data);
            setUser(parsed);
          } catch (parseError) {
            console.warn('Dados do usuário corrompidos, removendo...');
            await AsyncStorage.removeItem('@dogs/usuario_logado');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Erro ao carregar usuário:', error);
        setUser(null); 
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, []);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      const usuario = await UsuarioDAO.login(email, senha);
      if (usuario) {
        setUser(usuario);
        await AsyncStorage.setItem('@dogs/usuario_logado', JSON.stringify(usuario));
        return true;
      } else {
        setUser(null);
        await AsyncStorage.removeItem('@dogs/usuario_logado');
        return false;
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setUser(null);
      await AsyncStorage.removeItem('@dogs/usuario_logado');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deslogar = async () => {
    setLoading(true); 
    try {
      setUser(null);
      await AsyncStorage.removeItem('@dogs/usuario_logado');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, deslogar, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};