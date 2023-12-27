// ProtectedRoute.jsx
import React from 'react';
import Forbidden403 from './Forbidden403'; 
import { useAuth } from '../AuthContext'; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { roles } = useAuth(); // Ahora useAuth está definido

  const isAllowed = roles.some(role => allowedRoles.includes(role));

  // Renderiza los children si el usuario tiene el rol permitido, de lo contrario muestra Forbidden403
  return isAllowed ? children : <Forbidden403 />;
};

export default ProtectedRoute;
