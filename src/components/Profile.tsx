import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, MapPin, Bed, Bath, Square, X, Phone, ArrowLeft, Home, Building2, Landmark, Store } from 'lucide-react';
import { getProfile } from '../api/property';
import styles from './Profile.module.css';

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
  status: string;
  createdAt: string;
  views: number;
  isFeatured: boolean;
}

interface UserData {
  id: string;
  email: string;
  properties: Property[];
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

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
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

  const openModal = (property: Property) => {
    setSelectedProperty(property);
  };

  const closeModal = () => {
    setSelectedProperty(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

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
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.navLeft}>
            <button onClick={() => navigate('/')} className={styles.backButton}>
              <ArrowLeft size={24} />
              <span>Volver</span>
            </button>
          </div>
          <div className={styles.navcenter}>
          <h1 className={styles.title}>Mi Perfil</h1>
          <div className={styles.userEmail}>
              <span className={styles.emailLabel}>Email:</span>
              <span className={styles.emailValue}>{userData.email}</span>
            </div>
          </div>
          <div className={styles.navRight}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Mis Propiedades Publicadas</h2>
        
        {userData.properties && userData.properties.length > 0 ? (
          <div className={styles.propertyGrid}>
            {userData.properties.map((property) => (
              <div key={property._id} className={styles.propertyCard} onClick={() => openModal(property)}>
                <div className={styles.propertyBadges}>
                  <span className={`${styles.typeBadge} ${styles[property.type]}`}>
                    {property.type === 'sale' ? 'Venta' : 'Renta'}
                  </span>
                  {property.isFeatured && (
                    <span className={styles.featuredBadge}>Destacado</span>
                  )}
                </div>
                <img 
                  src={property.images?.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x200'}
                  alt={property.title}
                  className={styles.propertyImage}
                />
                <div className={styles.propertyContent}>
                  <div className={styles.propertyTypeHeader}>
                    <PropertyTypeIcon type={property.propertyType} />
                    
                  </div>
                  <h3 className={styles.propertyTitle}>{property.title}</h3>
                  <div className={styles.propertyPrice}>
                    <DollarSign className={styles.icon} />
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
                  <div className={styles.propertyFooter}>
                    <div className={styles.propertyStatus}>
                      Estado: <span className={styles[property.status]}>{property.status}</span>
                    </div>
                    <div className={styles.propertyViews}>
                      Vistas: {property.views}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noProperties}>No tienes propiedades publicadas.</p>
        )}
      </div>

      {/* Modal Rediseñado */}
      {selectedProperty && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleSection}>
                <div className={styles.modalTypeInfo}>
                  <PropertyTypeIcon type={selectedProperty.propertyType} />
                  <span className={`${styles.typeBadge} ${styles[selectedProperty.type]}`}>
                    {selectedProperty.type === 'sale' ? 'Venta' : 'Renta'}
                  </span>
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
              
              <div className={styles.modalStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Estado:</span>
                  <span className={`${styles.statValue} ${styles[selectedProperty.status]}`}>
                    {selectedProperty.status}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Vistas:</span>
                  <span className={styles.statValue}>{selectedProperty.views}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Publicado:</span>
                  <span className={styles.statValue}>
                    {new Date(selectedProperty.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;