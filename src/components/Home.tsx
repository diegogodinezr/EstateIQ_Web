import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, MapPin, Bed, Bath, Square, X, Phone, Home, Building2, Landmark, Store, Eye } from 'lucide-react';
import { getProperties, incrementPropertyViews } from '../api/property';
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
  type: 'sale' | 'rent';
  propertyType: 'House' | 'Apartment' | 'Land' | 'Commercial';
  contactNumber: string;
  views: number; // Añadido el campo views
}

const PropertyTypeIcon = ({ type }: { type: Property['propertyType'] }) => {
  switch (type) {
    case 'House':
      return <Home className={styles.typeIcon} />;
    case 'Apartment':
      return <Building2 className={styles.typeIcon} />;
    case 'Land':
      return <Landmark className={styles.typeIcon} />;
    case 'Commercial':
      return <Store className={styles.typeIcon} />;
    default:
      return <Home className={styles.typeIcon} />;
  }
};

const PropertyListing = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [propertyType, setPropertyType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }

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

  const openModal = async (property: Property) => {
    try {
      const lastView = localStorage.getItem(`property-view-${property._id}`);
      const now = new Date().getTime();
      
      // Solo incrementa las vistas si han pasado más de 24 horas desde la última vista
      if (!lastView || (now - parseInt(lastView)) > 24 * 60 * 60 * 1000) {
        const response = await incrementPropertyViews(property._id);
        localStorage.setItem(`property-view-${property._id}`, now.toString());
        setSelectedProperty(response.data);
        
        // Actualiza la lista de propiedades para reflejar el nuevo contador de vistas
        setProperties(properties.map(p => 
          p._id === property._id ? {...p, views: response.data.views} : p
        ));
      } else {
        setSelectedProperty(property);
      }
    } catch (error) {
      console.error('Error al abrir el modal:', error);
      setSelectedProperty(property);
    }
  };

  const closeModal = () => {
    setSelectedProperty(null);
  };

  const handleAddPropertyClick = () => {
    if (isLoggedIn) {
      navigate('/add-property');
    } else {
      localStorage.setItem('redirectAfterLogin', '/add-property');
      navigate('/login');
    }
  };

  const handleProfile = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      localStorage.setItem('redirectAfterLogin', '/profile');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <h1 className={styles.title}>EstateIQ</h1>
          <button onClick={handleAddPropertyClick} className={styles.addPropertyButton}>
            Agregar una propiedad
          </button>
          <button onClick={handleProfile} className={styles.profileButton}>
            Perfil
          </button>
          {isLoggedIn && (
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar sesión
            </button>
          )}
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
              <div className={styles.propertyImageContainer}>
                <img 
                  src={property.images?.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x200'}
                  alt={property.title}
                  className={styles.propertyImage}
                />
                <span className={`${styles.typeBadge} ${styles[property.type]}`}>
                  {property.type === 'sale' ? 'Venta' : 'Renta'}
                </span>
              </div>
              <div className={styles.propertyContent}>
                <div className={styles.propertyTypeHeader}>
                  <PropertyTypeIcon type={property.propertyType} />
                  <h3 className={styles.propertyTitle}>{property.title}</h3>
                </div>
                <div className={styles.propertyPrice}>
                  <span>${property.price.toLocaleString()}</span>
                  {property.type === 'rent' && <span className={styles.rentPeriod}>/mes</span>}
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

      {selectedProperty && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleSection}>
                <div className={styles.modalTypeInfo}>
                  <span className={`${styles.typeBadge} ${styles[selectedProperty.type]}`}>
                    {selectedProperty.type === 'sale' ? 'Venta' : 'Renta'}
                  </span>
                  <br />
                  <PropertyTypeIcon type={selectedProperty.propertyType} />
                </div>
                <h2 className={styles.modalTitle}>{selectedProperty.title}</h2>
              </div>
              
              <div className={styles.modalPriceSection}>
                <span className={styles.modalPrice}>
                  ${selectedProperty.price.toLocaleString()}
                  {selectedProperty.type === 'rent' && <span className={styles.rentPeriod}>/mes</span>}
                </span>
              </div>
            </div>

            <div className={styles.modalImageSection}>
              <img 
                src={selectedProperty.images?.length > 0 ? selectedProperty.images[0] : 'https://via.placeholder.com/400x200'}
                alt={selectedProperty.title}
                className={styles.modalImage}
              />
            </div>

            <div className={styles.modalMainInfo}>
              <div className={styles.modalLocation}>
                <MapPin className={styles.icon} />
                <span>{selectedProperty.location}</span>
              </div>
              
              <div className={styles.modalKeyDetails}>
                <div className={styles.modalDetailItem}>
                  <Bed className={styles.icon} />
                  <span>{selectedProperty.bedrooms} Habitaciones</span>
                </div>
                <div className={styles.modalDetailItem}>
                  <Bath className={styles.icon} />
                  <span>{selectedProperty.bathrooms} Baños</span>
                </div>
                <div className={styles.modalDetailItem}>
                  <Square className={styles.icon} />
                  <span>{selectedProperty.squaremeters} m²</span>
                </div>
                <div className={styles.modalDetailItem}>
                  <Eye className={styles.icon} />
                  <span>{selectedProperty.views || 0} visualizaciones</span>
                </div>
              </div>
            </div>

            <div className={styles.modalDescription}>
              <h3>Descripción</h3>
              <p>{selectedProperty.description}</p>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalContact}>
                <h3>Información de Contacto</h3>
                <div className={styles.contactInfo}>
                  <Phone className={styles.icon} />
                  <span>{selectedProperty.contactNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListing;