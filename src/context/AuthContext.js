import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger le token et les données utilisateur depuis le stockage sécurisé
    const loadStoredData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUser = await SecureStore.getItemAsync('userData');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.log('Error loading stored auth data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStoredData();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Remplacer par votre endpoint API réel
      const response = await axios.post('/users/login', { email, password });
      
      const { token, user } = response.data;
      
      // Stocker le token et les données utilisateur
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      
      // Définir le token d'authentification dans les en-têtes Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Remplacer par votre endpoint API réel
      const response = await axios.post('/users/register', userData);
      
      const { token, user } = response.data;
      
      // Stocker le token et les données utilisateur
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      
      // Définir le token d'authentification dans les en-têtes Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur d\'inscription';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Supprimer le token et les données utilisateur
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      
      // Réinitialiser les en-têtes Axios
      delete axios.defaults.headers.common['Authorization'];
      
      setToken(null);
      setUser(null);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      setLoading(true);
      
      // Remplacer par votre endpoint API réel
      const response = await axios.put(`/users/${user.id}`, updatedData);
      
      const updatedUser = response.data;
      
      // Mettre à jour les données utilisateur dans le stockage
      await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de mise à jour du profil';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      loading,
      login,
      register,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};