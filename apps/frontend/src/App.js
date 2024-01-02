// App.js
import React from 'react';
import { AuthProvider } from './components/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Users from './pages/Users';
import Blank from './components/layout/Blank';
import Matches from './components/matches/Matches';
import ProtectedRoute from './components/layout/ProtectedRoute';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Blank />} />
          <Route 
            path="users" 
            element={
              <ProtectedRoute allowedRoles={['padel-users-admin']}>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="matches" 
            element={
              <ProtectedRoute allowedRoles={['padel-users-admin', 'padel-user']}>
                <Matches />
              </ProtectedRoute>
            } 
          />
          {/* Asegúrate de que todas las demás rutas también estén correctamente anidadas aquí */}
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
