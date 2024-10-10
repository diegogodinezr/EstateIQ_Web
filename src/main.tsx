import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import AddProperty from './components/AddProperty';
import EditProperty from './components/EditProperty';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import './index.css';

// Lógica real de autenticación
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');  
  return token !== null && token !== '';  
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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
