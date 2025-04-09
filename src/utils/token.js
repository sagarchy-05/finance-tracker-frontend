export const getToken = () => {
  return localStorage.getItem('token');
};

export const getTokenData = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const { default: jwtDecode } = await import('jwt-decode');
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const isTokenExpired = async () => {
  const tokenData = await getTokenData();
  if (!tokenData) return true;

  const currentTime = Date.now() / 1000;
  return tokenData.exp < currentTime;
};

export const clearToken = () => {
  localStorage.removeItem('token');
};
