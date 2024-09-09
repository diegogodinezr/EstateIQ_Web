import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, DollarSign, MapPin, Bed, Bath, Square, Type, Image as ImageIcon, FileText, X, Phone } from 'lucide-react';
import styles from './AddProperty.module.css';
import { addPropertyRequest } from '../api/property';

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    squaremeters: '',
    description: '',
    type: 'sale',
    propertyType: 'House',
    contactNumber: '',
    isFeatured: false,
    images: [] as File[],
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleCancel = () => {
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setFormData({ ...formData, images: [...formData.images, ...newImages] });

      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });

    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (formData.title.trim() === '') {
      setFormError('El título es obligatorio');
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'images') {
        formDataToSend.append(key, value.toString());
      }
    });

    formData.images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    try {
      const response = await addPropertyRequest(formDataToSend);

      if (response.status === 200 || response.status === 201) {
        setFormSuccess('¡Propiedad agregada con éxito!');
        setFormData({
          title: '',
          price: '',
          location: '',
          bedrooms: '',
          bathrooms: '',
          squaremeters: '',
          description: '',
          type: 'sale',
          propertyType: 'House',
          contactNumber: '',
          isFeatured: false,
          images: [],
        });
        setPreviewImages([]);
      } else {
        setFormError('Hubo un error al agregar la propiedad');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormError('Hubo un error al agregar la propiedad');
    }
  };

  return (
    <div className={styles.addPropertyContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleCancel}>
          <X size={24} />
        </button>
        <h1>Agregar una propiedad</h1>
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
                type="text"
                name="price"
                placeholder="Precio"
                value={formData.price}
                onChange={handleChange}
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
            {/* <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className={styles.checkboxInput}
              />
              <label htmlFor="isFeatured" className={styles.checkboxLabel}>
                Destacar esta propiedad
              </label>
            </div> */}
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
          <div className={styles.imageUpload}>
            <label htmlFor="imagen" className={styles.imageUploadLabel}>
              <ImageIcon size={24} />
              <span>Agregar imágenes</span>
            </label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className={styles.imageInput}
            />
          </div>
          <div className={styles.imagePreviewContainer}>
            {previewImages.map((preview, index) => (
              <div key={index} className={styles.imagePreview}>
                <img src={preview} alt={`Preview ${index + 1}`} />
                <button type="button" onClick={() => removeImage(index)} className={styles.removeImageButton}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          {formError && <div className={styles.errorMessage}>{formError}</div>}
          {formSuccess && <div className={styles.successMessage}>{formSuccess}</div>}
          <div className={styles.formButtons}>
            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.publishButton}>
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;