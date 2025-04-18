import { isTokenExpired, clearToken } from './token';

export const startAuthWatcher = (logoutCallback) => {
  const checkInterval = 60 * 60 * 1000; // check every 1 hour

  const checkAuth = () => {
    if (isTokenExpired()) {
      clearToken();
      logoutCallback?.(); // Call the logout handler (e.g., redirect)
    }
  };

  const intervalId = setInterval(checkAuth, checkInterval);

  return () => clearInterval(intervalId); // return stop function
};
