import { useState } from 'react';
import { AuthContext } from './auth.context';

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);

  const URL_BASE = import.meta.env.VITE_URL_BASE; 

  const login = async (user) => { 
    try {
      const response = await fetch(`${URL_BASE}/login`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user), 
      });

      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const register = async (user) => {
    try {
      const response = await fetch(`${URL_BASE}/register`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(user) 
      });

      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('x-token');
    window.location.reload()
  };

  const isTokenValid = async () => {
    const token = localStorage.getItem("x-token");

    if (!token) {
      setIsLogged(false);
      return false;
    } else {
      const response = await fetch(`${URL_BASE}/validate`, {
        method: "GET",
        headers: {
          "x-token": `${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      const data = await response.json();
      setIsLogged(data.msg);
      return data;
    }
  };

  const authContext = { isLogged, login, register, logout, isTokenValid };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};