import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import AddProperty from './components/AddProperty';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';  // Asumimos que tienes un componente Profile
import './index.css';

// Lógica real de autenticación
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');  // Aquí almacenamos el token después del login
  return token !== null && token !== '';  // Verifica si el token existe y no está vacío
};

// Componente para proteger rutas privadas
interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation();
  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />  // Pasa toda la ubicación, no solo `pathname`
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/add-property"
          element={
            <PrivateRoute>
              <AddProperty />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
