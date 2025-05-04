import axios from 'axios';

// Définir l'URL de base pour toutes les requêtes
const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // À remplacer par l'URL de votre API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Gérer les erreurs d'authentification ici
    }
    return Promise.reject(error);
  }
);

export default instance;