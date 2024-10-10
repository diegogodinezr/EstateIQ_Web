import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DollarSign, MapPin, Bed, Bath, Square, Type, Image as ImageIcon, FileText, X, Phone } from 'lucide-react';
import styles from './AddProperty.module.css';
import { updateProperty, getPropertyById } from '../api/property';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squaremeters: number;
  description: string;
  type: 'sale' | 'rent';
  propertyType: 'House' | 'Apartment' | 'Land' | 'Commercial';
  contactNumber: string;
  images: string[];
  isFeatured: boolean;
}

const EditProperty: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<Property>({
    _id: '',
    title: '',
    price: 0,
    location: '',
    bedrooms: 0,
    bathrooms: 0,
    squaremeters: 0,
    description: '',
    type: 'sale',
    propertyType: 'House',
    contactNumber: '',
    isFeatured: false,
    images: [],
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [, setIsLoading] = useState(true);
  const [newImages, setNewImages] = useState<File[]>([]);


  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) {
        setFormError('ID de propiedad no proporcionado');
        setIsLoading(false);
        return;
      }

      try {
        const response = await getPropertyById(id);
        const data: Property = response.data;
        
        setFormData(data);
        setExistingImages(data.images || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos de la propiedad:', error);
        setFormError('Error al cargar los datos de la propiedad');
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files); // Archivos de tipo File[]
      setNewImages([...newImages, ...newFiles]); // Guardamos los archivos en el estado de `newImages`
  
      // Generar URLs para las vistas previas
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviews]);
    }
  };

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
    } else {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });

      const newPreviews = [...previewImages];
      newPreviews.splice(index, 1);
      setPreviewImages(newPreviews);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
  
    if (formData.title.trim() === '') {
      setFormError('El título es obligatorio');
      return;
    }
  
    if (formData.price <= 0) {
      setFormError('El precio debe ser mayor que cero');
      return;
    }
  
    const formDataToSend = new FormData();
    
    // Adjuntar el resto de los campos del formulario
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'images') {
        formDataToSend.append(key, value.toString());
      }
    });
  
    // Adjuntar las nuevas imágenes (tipo File[])
    newImages.forEach((image) => {
      formDataToSend.append('images', image); // Agregar las nuevas imágenes
    });
  
    // Adjuntar las URLs de las imágenes existentes que no se eliminaron
    formData.images.forEach((imageUrl) => {
      formDataToSend.append('existingImages', imageUrl); // Agregar las URLs de imágenes existentes
    });
  
    try {
      setIsLoading(true); // Activar el estado de carga
      const response = await updateProperty(id!, formDataToSend);
  
      if (response.status === 200) {
        setFormSuccess('¡Propiedad actualizada con éxito!');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setFormError('Hubo un error al actualizar la propiedad');
    } finally {
      setIsLoading(false); // Desactivar el estado de carga
    }
  };
  

  return (
    <div className={styles.addPropertyContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/profile')}>
          <X size={24} />
        </button>
        <h1>Modificar propiedad</h1>
      </div>
      <div className={styles.content}>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <Type className={styles.inputIcon} />
              <input
                type="text"
                name="title"
                placeholder="Título"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <DollarSign className={styles.inputIcon} />
              <input
                type="number"
                name="price"
                placeholder="Precio"
                value={formData.price}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className={styles.inputGroup}>
              <MapPin className={styles.inputIcon} />
              <input
                type="text"
                name="location"
                placeholder="Ubicación"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <Bed className={styles.inputIcon} />
              <input
                type="number"
                name="bedrooms"
                placeholder="Recámaras"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className={styles.inputGroup}>
              <Bath className={styles.inputIcon} />
              <input
                type="number"
                name="bathrooms"
                placeholder="Baños"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className={styles.inputGroup}>
              <Square className={styles.inputIcon} />
              <input
                type="number"
                name="squaremeters"
                placeholder="m²"
                value={formData.squaremeters}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className={styles.selectGroup}>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="sale">Venta</option>
                <option value="rent">Renta</option>
              </select>
            </div>
            <div className={styles.selectGroup}>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="House">Casa</option>
                <option value="Apartment">Apartamento</option>
                <option value="Land">Terreno</option>
                <option value="Commercial">Comercial</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <Phone className={styles.inputIcon} />
              <input
                type="text"
                name="contactNumber"
                placeholder="Número de contacto"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <FileText className={styles.inputIcon} />
            <textarea
              name="description"
              placeholder="Detalles"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Imágenes existentes */}
          <div className={styles.imagePreviewContainer}>
            {existingImages.map((imageUrl, index) => (
              <div key={`existing-${index}`} className={styles.imagePreview}>
                <img src={imageUrl} alt={`Imagen existente ${index + 1}`} />
                <button type="button" className={styles.removeImageButton} onClick={() => removeImage(index, true)}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Previews de nuevas imágenes */}
          <div className={styles.imagePreviewContainer}>
            {previewImages.map((imageUrl, index) => (
              <div key={`new-${index}`} className={styles.imagePreview}>
                <img src={imageUrl} alt={`Nueva imagen ${index + 1}`} />
                <button type="button" className={styles.removeImageButton} onClick={() => removeImage(index)}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Input para subir imágenes */}
          <div className={styles.inputGroup}>
            <ImageIcon className={styles.inputIcon} />
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Guardar cambios
          </button>
          {formError && <div className={styles.errorMessage}>{formError}</div>}
          {formSuccess && <div className={styles.successMessage}>{formSuccess}</div>}
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
