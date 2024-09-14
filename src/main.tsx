import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AddProperty from './components/AddProperty';
import Register from './components/Register'; // Importa el componente de Registro
import Login from './components/Login'; // Importa el componente de Login
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/register" element={<Register />} /> {/* Nueva ruta para Registro */}
        <Route path="/login" element={<Login />} /> {/* Nueva ruta para Login */}
      </Routes>
    </Router>
  </React.StrictMode>
);
