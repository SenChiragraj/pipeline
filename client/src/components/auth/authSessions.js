// src/auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export const logout = () => {
  localStorage.removeItem('accessToken');
};

export const getToken = () => {
  return localStorage.getItem('accessToken');
};
