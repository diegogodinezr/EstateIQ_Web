import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    images: [] as File[], // Array para guardar las imágenes
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleCancel = () => {
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFormData({ ...formData, images: [...formData.images, file] });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

    const formDataToSend = new FormData();

    formDataToSend.append('title', formData.title);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('bedrooms', formData.bedrooms);
    formDataToSend.append('bathrooms', formData.bathrooms);
    formDataToSend.append('squaremeters', formData.squaremeters);
    formDataToSend.append('description', formData.description);

    for (const image of formData.images) {
      formDataToSend.append('images', image, image.name);
    }

    try {
      const response = await addPropertyRequest(formDataToSend);

      if (response.status === 200 || response.status === 201) {
        setFormSuccess('¡Propiedad agregada con éxito!');
        // Aquí puedes limpiar el formulario si lo deseas
        setFormData({
          title: '',
          price: '',
          location: '',
          bedrooms: '',
          bathrooms: '',
          squaremeters: '',
          description: '',
          images: [],
        });
        setPreviewImage(null);
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
          ←
        </button>
        <h1>Agregar una propiedad</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="title"
              placeholder="Titulo"
              value={formData.title}
              onChange={handleChange}
            />
            <input
              type="text"
              name="price"
              placeholder="Precio"
              value={formData.price}
              onChange={handleChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Ubicación"
              value={formData.location}
              onChange={handleChange}
            />
            <div className={styles.horizontalFields}>
              <input
                type="number"
                name="bedrooms"
                placeholder="Recamaras"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
              />
              <input
                type="number"
                name="bathrooms"
                placeholder="Baños"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
              />
              <input
                type="number"
                name="squaremeters"
                placeholder="m²"
                value={formData.squaremeters}
                onChange={handleChange}
                min="0"
              />
            </div>
            <textarea
              name="description"
              placeholder="Detalles"
              value={formData.description}
              onChange={handleChange}
            />
            <div>
              <label htmlFor="imagen" style={{ color: 'black' }}>Imagen:</label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {previewImage && (
              <div>
                <img src={previewImage} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
              </div>
            )}
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
        <div className={styles.propertyImage}>
          <img src="/img/casa.jpg" alt="Property" />
        </div>
      </div>
    </div>
  );
};

export default AddProperty;