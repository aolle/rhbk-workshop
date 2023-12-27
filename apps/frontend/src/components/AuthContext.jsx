// AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import Keycloak from "keycloak-js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");  // Agregar estado para el nombre de usuario
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const kc = new Keycloak('/keycloak.json');
    kc.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    })
      .then(auth => {
        setKeycloak(kc);
        setAuthenticated(auth);
        if (auth) {
          // Establecer nombre de usuario y roles
          setUsername(kc.tokenParsed.preferred_username);
          const userRoles = kc.tokenParsed.realm_access?.roles || [];
          setRoles(userRoles);
        }
      });
  }, []);

  const login = () => keycloak?.login();
  const logout = () => keycloak?.logout();

  return (
    <AuthContext.Provider value={{ authenticated, username, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
