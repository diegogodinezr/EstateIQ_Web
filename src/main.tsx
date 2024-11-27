import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import AddProperty from './components/AddProperty';
import EditProperty from './components/EditProperty';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Statistics from './components/Statistics'; 
import Statistics3 from './components/UserStats'; 
import Statistics2 from './components/PropertyStats'; 
import './index.css';
import LandingPage from './components/Landing';

// Lógica real de autenticación
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');  
  return token !== null && token !== '';  
};

// Función para verificar si el usuario es admin
const isAdmin = () => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificamos el payload del JWT
    return decodedToken.role === 'admin'; // Verificamos si el rol es admin
  }

  return false;
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
    <Navigate to="/login" state={{ from: location }} />
  );
}

// Componente para proteger rutas de administrador
function AdminRoute({ children }: PrivateRouteProps) {
  const location = useLocation();
  return isAuthenticated() && isAdmin() ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Mostrar la LandingPage como la ruta principal */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/add-property"
          element={
            <PrivateRoute>
              <AddProperty />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-property/:id"
          element={
            <PrivateRoute>
              <EditProperty />
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
        {/* Ruta protegida para estadísticas */}
        <Route
          path="/statistics"
          element={
            <AdminRoute>
              <Statistics />
            </AdminRoute>
          }
        />
        <Route
          path="/statistics3"
          element={
            <AdminRoute>
              <Statistics3 />
            </AdminRoute>
          }
        />
          <Route
          path="/statistics2"
          element={
            <AdminRoute>
              <Statistics2 />
            </AdminRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
