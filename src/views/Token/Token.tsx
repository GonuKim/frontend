export const getTokenFromStorage = (key: string): string | null => {
    return sessionStorage.getItem(key);
  };
  
  export const saveTokenToStorage = (key: string, token: string): void => {
    sessionStorage.setItem(key, token);
  };
  
  export const removeTokenFromStorage = (key: string): void => {
    sessionStorage.removeItem(key);
  };

  