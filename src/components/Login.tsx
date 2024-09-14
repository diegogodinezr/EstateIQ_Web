import React, { useState } from 'react';
import { loginUser } from '../api/property';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; // Importa los estilos CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await loginUser({ email, password });

      // Almacena el token en localStorage (asegúrate de que el backend devuelva un token)
      localStorage.setItem('authToken', response.data.token); // Ajusta esto según el nombre del token que recibas

      alert('Inicio de sesión exitoso!');
      navigate('/add-property'); // Redirige al dashboard
    } catch (err) {
      setError('Error al iniciar sesión. Intente nuevamente.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
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
          <button type="submit" className={styles.loginButton}>Iniciar Sesión</button>
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
