export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const setCookie = (name, value, days = 7) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  
  document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const getAuthToken = () => {
  // Try to get token from cookie first
  const cookieToken = getCookie('authToken');
  if (cookieToken) {
    return cookieToken;
  }
  
  // Fallback to localStorage
  const localToken = localStorage.getItem('authToken');
  return localToken;
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
}; 