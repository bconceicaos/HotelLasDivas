import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkAuth } from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica si hay un usuario logueado al cargar
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await checkAuth();
        setUser(userData || null);
      } catch (error) {
        // No mostramos error porque checkAuth ya lo maneja
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);



  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/'); // Navegación fluida sin recarga
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
