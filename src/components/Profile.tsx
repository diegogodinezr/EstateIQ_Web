import { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken'); // Asegúrate de que el token esté en localStorage
      if (!token) {
        setError('No authentication token found');
        return;
      }

      try {
        const response = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${token}` // Envía el token en el encabezado
          }
        });
        setUserData(response.data); // Asume que los datos del usuario están en response.data
      } catch (err) {
        console.error(err);
        setError('Error fetching user profile');
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading user data...</div>; // Se muestra mientras se carga la data
  }

  return (
    <div>
      <h1>Perfil del Usuario</h1>
      <p>Email: {userData.email}</p>
      <p>ID: {userData.id}</p>

      {/* Mostrar propiedades si existen */}
      <h2>Propiedades publicadas:</h2>
      {userData.properties && userData.properties.length > 0 ? (
        <ul>
          {userData.properties.map((property: any) => (
            <li key={property._id}>
              <p>Título: {property.title}</p>
              <p>Precio: {property.price}</p>
              <p>Ubicación: {property.location}</p>
              <p>Estado: {property.status}</p>
              <p>Creado el: {new Date(property.createdAt).toLocaleDateString()}</p>
              {/* Puedes agregar más campos aquí según lo necesites */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes propiedades publicadas.</p>
      )}
    </div>
  );
};

export default UserProfile;
