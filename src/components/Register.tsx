import React, { useState } from 'react';
import { registerUser } from '../api/property';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); // Reinicia el mensaje de error

    try {
      // Llama a la función de API para registrar el usuario
      const response = await registerUser({ email, password });
      alert('Usuario registrado exitosamente!');
      // Redirige al usuario o realiza alguna acción
    } catch (err: any) {
      setError('Error al registrar el usuario. Intente nuevamente.');
      console.error(err.response?.data?.message || 'Error desconocido');
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
