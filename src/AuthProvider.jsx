import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  const login = (user, accessToken) => {
    setAuth({ user, accessToken });
    sessionStorage.setItem("auth", JSON.stringify({ user, accessToken }));
  };

  const logout = () => {
    setAuth({ user: "", accessToken: "" });
    sessionStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
