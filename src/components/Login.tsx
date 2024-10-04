// Login.tsx
import React, { useState } from 'react';
import { loginUser } from '../api/property';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.css';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await loginUser({ email, password });
      const data = response.data as LoginResponse;

      if (data.token) {
        setSuccessMessage('¡Inicio de sesión exitoso!');
        
        setTimeout(() => {
          navigate(from);
        }, 2000);
      } else {
        setError('No se recibió el token de autenticación');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Intente nuevamente.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email:</label>
            <input
              className={styles.inputField}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Contraseña:</label>
            <input
              className={styles.inputField}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Iniciar Sesión
          </button>
        </form>
        <p className={styles.registerLink}>
          ¿No tienes una cuenta?{' '}
          <span onClick={() => navigate('/register')} className={styles.link}>
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;