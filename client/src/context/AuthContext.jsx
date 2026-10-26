import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('hotelpro_user') || 'null'));

  const save = (data) => {
    localStorage.setItem('hotelpro_user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    save(data);
  };

  const register = async (form) => {
    const { data } = await api.post('/auth/register', form);
    save(data);
  };

  const logout = () => {
    localStorage.removeItem('hotelpro_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
  );
}
