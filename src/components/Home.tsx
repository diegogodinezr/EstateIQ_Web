import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { getProperties } from '../api/property'; // Importa la función para obtener propiedades

interface Property {
  _id: string; 
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squaremeters: number;
  description: string;
  images: string[]; 
}

const PropertyListing = () => {
  const [properties, setProperties] = useState<Property[]>([]); // Estado para las propiedades

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProperties(); 
        setProperties(response.data as Property[]); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        console.error('Error al obtener propiedades:', error);
      }
    };

    fetchData(); // Llama a la función para obtener los datos al cargar el componente
  }, []); // El segundo argumento del useEffect es un array de dependencias, en este caso, [] significa que solo se ejecuta una vez al cargar el componente

  return (
    <div className={styles.homeContainer}>
      <div className={styles.propertyListingContainer}>
        <div className={styles.header}>
          <h1>EstateIQ</h1>
        </div>
        <div className={styles.propertiesGrid}>
          {properties.map((property) => (
            <div className={styles.propertyCard} key={property._id}> {/* Utiliza el _id como clave */}
              <img 
                src={property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/200'} 
                alt={property.title} 
                onError={(error) => { 
                  console.log(`Error al cargar la imagen: ${property.images[0]}`, error); 
                }} 
              /> {/* Suponiendo que images es un array de URLs de imágenes */}
              <h3>{property.title}</h3>
              <p>Precio: ${property.price}</p>
              <p>Ubicación: {property.location}</p>
              <p>Recámaras: {property.bedrooms}</p>
              <p>Baños: {property.bathrooms}</p>
              <p>Metros cuadrados: {property.squaremeters}</p>
              <p className={styles.propertyDetails}>{property.description}</p>
            </div>
          ))}
        </div>
        <Link to="/add-property" className={styles.addPropertyButton}>
          Agregar una propiedad
        </Link>
      </div>
    </div>
  );
};

export default PropertyListing;