import React, { useState } from 'react';
import { loginUser } from '../api/property';  // Asegúrate de que esta función haga la solicitud al backend y retorne el token
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.css';  // Importa los estilos CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // Estado para el mensaje de éxito
  const navigate = useNavigate();
  const location = useLocation();

  // Extrae la ruta desde donde fue redirigido el usuario
  const from = location.state?.from?.pathname || '/';  // Si no hay "from", redirige al home por defecto

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');  // Reinicia el mensaje de éxito

    try {
      const response = await loginUser({ email, password });

      // Almacena el token en localStorage (asegúrate de que el backend devuelva un token)
      localStorage.setItem('authToken', response.data.token); 

      // Muestra el mensaje de éxito
      setSuccessMessage('Inicio de sesión exitoso!');
      
      // Redirige después de 2 segundos a la página que intentaba acceder antes de loguearse
      setTimeout(() => {
        navigate(from);  // Redirige a la ruta que estaba intentando acceder
      }, 2000);
    } catch (err) {
      setError('Error al iniciar sesión. Intente nuevamente.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}  {/* Muestra el mensaje de éxito */}
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