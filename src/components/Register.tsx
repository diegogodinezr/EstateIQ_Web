// Register.tsx
import React, { useState } from 'react';
import { registerUser } from '../api/property';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await registerUser({ email, password });
      const data = response.data as RegisterResponse;

      if (data.token) {
        setSuccessMessage('¡Usuario registrado exitosamente!');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Error en el registro');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar el usuario. Intente nuevamente.');
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
          <button type="submit" className={styles.registerButton}>
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;