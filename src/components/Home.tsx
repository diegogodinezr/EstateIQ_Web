import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const PropertyListing = () => {
  const properties = [
    {
      id: 1,
      title: 'Casa de ensueño',
      price: '$500,000',
      location: 'Ciudad de México',
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      details: 'Hermosa casa con vista al mar',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      title: 'Departamento moderno',
      price: '$250,000',
      location: 'Guadalajara',
      bedrooms: 2,
      bathrooms: 1,
      area: 80,
      details: 'Departamento recién remodelado en zona céntrica',
      image: 'https://via.placeholder.com/300x200',
    },
    // Agrega más propiedades ficticias aquí
  ];

  return (
    <div className={styles.homeContainer}>
      <div className={styles.propertyListingContainer}>
        <div className={styles.header}>
          <h1>EstateIQ</h1>
        </div>
        <div className={styles.propertiesGrid}>
          {properties.map((property) => (
            <div className={styles.propertyCard} key={property.id}>
              <img src={property.image} alt={property.title} />
              <h3>{property.title}</h3>
              <p>Precio: {property.price}</p>
              <p>Ubicación: {property.location}</p>
              <p>Recámaras: {property.bedrooms}</p>
              <p>Baños: {property.bathrooms}</p>
              <p>Metros cuadrados: {property.area}</p>
              <p className={styles.propertyDetails}>{property.details}</p>
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
