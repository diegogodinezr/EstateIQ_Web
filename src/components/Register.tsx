import React, { useState } from 'react';
import { registerUser } from '../api/property';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css'; // Importa los estilos CSS

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Estado para mensaje de éxito
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage(''); // Reinicia el mensaje de éxito

    try {
      // Llama a la función de API para registrar el usuario
      const response = await registerUser({ email, password });

      // Muestra el mensaje de éxito
      setSuccessMessage('Usuario registrado exitosamente!');
      
      // Redirige después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Ajusta la redirección según tu necesidad
    } catch (err: any) {
      setError('Error al registrar el usuario. Intente nuevamente.');
      console.error(err.response?.data?.message || 'Error desconocido');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Registro</h2>
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
          <button type="submit" className={styles.registerButton}>Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
