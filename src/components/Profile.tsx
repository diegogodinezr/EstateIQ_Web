// Profile.tsx
import React, { useState, useEffect } from 'react';
import { getProfile } from '../api/property';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css'; // Asegúrate de crear este archivo de estilos

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  status: string;
  createdAt: string;
}

interface UserData {
  id: string;
  email: string;
  properties: Property[];
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        
        if (response && response.data) {
          setUserData(response.data);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          navigate('/login');
        }
        setError(err.response?.data?.message || 'Error al obtener el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return <div className={styles.loading}>Cargando perfil...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!userData) {
    return <div className={styles.error}>No se encontró información del usuario</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.userInfo}>
        <h1>Perfil del Usuario</h1>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>ID:</strong> {userData.id}</p>
      </div>

      <div className={styles.propertiesSection}>
        <h2>Propiedades publicadas</h2>
        {userData.properties && userData.properties.length > 0 ? (
          <div className={styles.propertiesList}>
            {userData.properties.map((property) => (
              <div key={property._id} className={styles.propertyCard}>
                <h3>{property.title}</h3>
                <p><strong>Precio:</strong> ${property.price}</p>
                <p><strong>Ubicación:</strong> {property.location}</p>
                <p><strong>Estado:</strong> {property.status}</p>
                <p><strong>Fecha de publicación:</strong> {
                  new Date(property.createdAt).toLocaleDateString()
                }</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noProperties}>No tienes propiedades publicadas.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;