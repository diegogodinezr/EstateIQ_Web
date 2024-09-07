import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, DollarSign, MapPin, Bed, Bath, Square, Search, X } from 'lucide-react'; // Agregué el icono de cierre (X)
import { getProperties } from '../api/property';
import styles from './PropertyListing.module.css';

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
  type: string;
  propertyType: string;
}

const PropertyListing = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [propertyType, setPropertyType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null); // Estado para la propiedad seleccionada

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProperties({
          type: filter,
          propertyType,
          location,
          minPrice,
          maxPrice,
        });
        setProperties(response.data as Property[]);
      } catch (error) {
        console.error('Error al obtener propiedades:', error);
      }
    };

    fetchData();
  }, [filter, propertyType, location, minPrice, maxPrice]);

  const openModal = (property: Property) => {
    setSelectedProperty(property);
  };

  const closeModal = () => {
    setSelectedProperty(null);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <h1 className={styles.title}>EstateIQ</h1>
          <Link to="/add-property" className={styles.addPropertyButton}>
            Agregar una propiedad
          </Link>
        </div>
      </nav>

      <div className={styles.content}>
        <div className={styles.filters}>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'sale' ? styles.active : ''}`}
              onClick={() => setFilter('sale')}
            >
              En Venta
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'rent' ? styles.active : ''}`}
              onClick={() => setFilter('rent')}
            >
              En Renta
            </button>
          </div>
          <div className={styles.additionalFilters}>
            <div className={styles.selectWrapper}>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={styles.select}
              >
                <option value="">Todos los tipos</option>
                <option value="House">Casa</option>
                <option value="Apartment">Apartamento</option>
                <option value="Land">Terreno</option>
                <option value="Commercial">Comercial</option>
              </select>
            </div>
            <div className={styles.inputWrapper}>
              <MapPin className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Ubicación"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputWrapper}>
              <DollarSign className={styles.inputIcon} />
              <input
                type="number"
                placeholder="Precio Mínimo"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value) || '')}
                className={styles.input}
              />
            </div>
            <div className={styles.inputWrapper}>
              <DollarSign className={styles.inputIcon} />
              <input
                type="number"
                placeholder="Precio Máximo"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value) || '')}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className={styles.propertyGrid}>
          {properties.map((property) => (
            <div key={property._id} className={styles.propertyCard} onClick={() => openModal(property)}>
              <img 
                src={property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x200'}
                alt={property.title}
                className={styles.propertyImage}
              />
              <div className={styles.propertyContent}>
                <h3 className={styles.propertyTitle}>{property.title}</h3>
                <div className={styles.propertyPrice}>
                  <DollarSign className={styles.icon} />
                  <span>${property.price.toLocaleString()}</span>
                </div>
                <div className={styles.propertyLocation}>
                  <MapPin className={styles.icon} />
                  <span>{property.location}</span>
                </div>
                <div className={styles.propertyDetails}>
                  <div className={styles.detailItem}>
                    <Bed className={styles.icon} />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Bath className={styles.icon} />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Square className={styles.icon} />
                    <span>{property.squaremeters} m²</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProperty && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeModal}>
              <X size={24} />
            </button>
            <h2 className={styles.modalTitle}>{selectedProperty.title}</h2>
            <img 
              src={selectedProperty.images.length > 0 ? selectedProperty.images[0] : 'https://via.placeholder.com/400x200'}
              alt={selectedProperty.title}
              className={styles.modalImage}
            />
            <p className={styles.modalDescription}>{selectedProperty.description}</p>
            <div className={styles.modalDetails}>
              <div className={styles.modalDetailItem}>
                <DollarSign className={styles.icon} />
                <span>${selectedProperty.price.toLocaleString()}</span>
              </div>
              <div className={styles.modalDetailItem}>
                <MapPin className={styles.icon} />
                <span>{selectedProperty.location}</span>
              </div>
              <div className={styles.modalDetailItem}>
                <Bed className={styles.icon} />
                <span>{selectedProperty.bedrooms} habitaciones</span>
              </div>
              <div className={styles.modalDetailItem}>
                <Bath className={styles.icon} />
                <span>{selectedProperty.bathrooms} baños</span>
              </div>
              <div className={styles.modalDetailItem}>
                <Square className={styles.icon} />
                <span>{selectedProperty.squaremeters} m²</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListing;
