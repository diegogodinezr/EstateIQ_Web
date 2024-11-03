import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, X, Phone, ArrowLeft, Home, Building2, Landmark, Store } from 'lucide-react';
import { getProfile, deleteProperty, updatePhysicalVisits } from '../api/property';
import styles from './Profile.module.css';

interface Property {
  _id: string;
  title: string;
  price: number;
  calleYNumero: string;
  colonia: string;
  codigoPostal: string;
  estado: string;
  municipio: string;
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
  physicalVisits: number;
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
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null); // Estado para el modal de eliminación
  const [filter, setFilter] = useState<'active' | 'deleted'>('active'); // Estado del filtro
  const [physicalVisits, setPhysicalVisits] = useState<number>(0); // Contador de visitas presenciales
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


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
    setPhysicalVisits(property.physicalVisits); // Inicializar el contador de visitas presenciales
  };

  const handleIncrementVisits = () => {
    setPhysicalVisits((prev) => prev + 1);
  };
  const handleSavePhysicalVisits = async () => {
    if (selectedProperty) {
      try {
        await updatePhysicalVisits(selectedProperty._id, physicalVisits); // Llamada al backend
        
        // Actualizar el estado con las nuevas visitas presenciales
        setUserData((prevData) => {
          if (!prevData) return null;
          const updatedProperties = prevData.properties.map((prop) => {
            if (prop._id === selectedProperty._id) {
              return { ...prop, physicalVisits }; // Actualizar las visitas presenciales
            }
            return prop;
          });
          return { ...prevData, properties: updatedProperties };
        });
  
        // Establecer el mensaje de éxito
        setSuccessMessage('Visitas presenciales actualizadas exitosamente');
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        
      } catch (error) {
        console.error('Error al actualizar las visitas presenciales', error);
      }
    }
  };
  
  const filteredProperties = userData?.properties.filter(property => {
    if (filter === 'active') {
      return property.status !== 'deleted';
    } else if (filter === 'deleted') {
      return property.status === 'deleted';
    }
    return true;
  });

  const openDeleteModal = (property: Property) => {
    setPropertyToDelete(property); // Abrir modal de eliminar
  };

  const closeDeleteModal = () => {
    setPropertyToDelete(null); // Cerrar modal de eliminar
  };
  
  const closeModal = () => {
    setSelectedProperty(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleDeleteProperty = async (propertyId: string, deleteReason: string) => {
    if (propertyId && deleteReason) {
      try {
        await deleteProperty(propertyId, deleteReason);
        
        // Actualizar el estado de userData con la propiedad actualizada
        setUserData((prevData) => {
          if (!prevData) return null;
          
          const updatedProperties = prevData.properties.map(prop => {
            if (prop._id === propertyId) {
              return {
                ...prop,
                status: 'deleted' // Actualizar el estado de la propiedad a 'deleted'
              };
            }
            return prop;
          });
  
          return {
            ...prevData,
            properties: updatedProperties
          };
        });
  
        // Cerrar ambos modales
        setPropertyToDelete(null);
        setSelectedProperty(null);
        
        // Si estamos en la vista de activas, podríamos mostrar un mensaje de éxito
        if (filter === 'active') {
          // Opcional: Mostrar un mensaje de éxito
          // setSuccessMessage('Propiedad eliminada correctamente');
        }
      } catch (err) {
        console.error('Error al eliminar propiedad:', err);
        // Opcional: Mostrar un mensaje de error
        // setErrorMessage('Error al eliminar la propiedad');
      }
    } else {
      alert('Motivo no válido o propiedad no seleccionada.');
    }
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
      
      {/* Botones para filtrar */}
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${filter === 'active' ? styles.activeFilter : ''}`}
          onClick={() => setFilter('active')}
        >
          Activas
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'deleted' ? styles.activeFilter : ''}`}
          onClick={() => setFilter('deleted')}
        >
          Eliminadas
        </button>
      </div>

      {filteredProperties && filteredProperties.length > 0 ? (
        <div className={styles.propertyGrid}>
          {filteredProperties.map((property) => (
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
                {property.isFeatured && (
                  <span className={styles.featuredBadge}>Destacado</span>
                )}
              </div>
              <div className={styles.propertyContent}>
                <div className={styles.propertyTypeHeader}>
                  <h3 className={styles.propertyTitle}>{property.title}</h3>
                </div>
                <div className={styles.propertyPrice}>
                  <span>${property.price.toLocaleString()}</span>
                  {property.type === 'rent' && <span className={styles.rentPeriod}>/mes</span>}
                </div>
                <div className={styles.propertyLocation}>
                  <MapPin className={styles.icon} />
                  <span>{property.estado}, {property.municipio}</span>
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
        <p className={styles.noProperties}>No tienes propiedades en esta categoría.</p>
      )}
    </div>

    {/* Modal Rediseñado */}
    {selectedProperty && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
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
                <span>
                  {selectedProperty.calleYNumero}, {selectedProperty.colonia}, 
                  CP {selectedProperty.codigoPostal}, {selectedProperty.municipio}, {selectedProperty.estado}
                </span>
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
          
            {/* Contador de visitas presenciales */}  
            <div className={styles.modalStats}>
              <div className={styles.counterContainer}>
                <span className={styles.counterLabel}>Visitas Presenciales:</span>
                <span className={styles.counterValue}>{physicalVisits}</span>
                <button onClick={handleIncrementVisits} className={styles.incrementButton}>
                  +
                </button>
              </div>
            </div>

            {/* Mensaje de éxito */}
            {successMessage && (
              <div className={styles.successMessage}>
                {successMessage}
              </div>
            )}
            <div className={styles.modalActions}>
              <button onClick={handleSavePhysicalVisits} className={styles.saveButton}>
                Guardar
              </button>
            </div>
            {/* Botones de Modificar y Eliminar */}
            <div className={styles.modalActions}>
              <button
                className={styles.editButton}
                onClick={() => navigate(`/edit-property/${selectedProperty._id}`)}
              >
                Modificar Propiedad
              </button>

              {/* Aquí está la implementación del modal para el motivo de eliminación */}
              <button
                className={styles.deleteButton}
                onClick={() => openDeleteModal(selectedProperty)} // Abrir modal de eliminación
              >
                Eliminar Propiedad
              </button>
            </div>

      {/* Modal de eliminación de propiedad */}
      {propertyToDelete && (
  <div className={styles.modalOverlay} onClick={closeDeleteModal}>
    <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeButton} onClick={closeDeleteModal}>
        <X size={24} />
      </button>

      <div className={styles.deleteModalHeader}>
        <h2>Eliminar propiedad</h2>
        <p>Selecciona el motivo de eliminación:</p>
      </div>

      <div>
        <button
          className={styles.deleteReasonButton}
          onClick={() => handleDeleteProperty(propertyToDelete._id, 'completed')}
        >
          Completada
        </button>
        <button
          className={styles.deleteReasonButton}
          onClick={() => handleDeleteProperty(propertyToDelete._id, 'cancelled')}
        >
          Cancelada
        </button>
        <button
          className={styles.deleteReasonButton}
          onClick={() => handleDeleteProperty(propertyToDelete._id, 'other')}
        >
          Otra
        </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;