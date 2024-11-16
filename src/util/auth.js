import { jwtDecode } from "jwt-decode";
export const getTokenRemainingTime = (token) => {
    if (!token) return 0;
  
    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 - Date.now();
    } catch (error) {
      return 0;
    }
  };