import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddProperty.module.css';

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    precio: '',
    ubicacion: '',
    recamaras: 0,
    banos: 0,
    metros: 0,
    detalles: '',
    imagen: null as File | null,
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
      setFormData({ ...formData, imagen: file });
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

    if (formData.titulo.trim() === '') {
      setFormError('El título es obligatorio');
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSend.append(key, (formData[key as keyof typeof formData] as any));
      }
    }

    // Aquí simularías el envío de los datos a tu API (Reemplaza con tu lógica)
    // try {
    //   const response = await fetch('/api/propiedades', {
    //     method: 'POST',
    //     body: formDataToSend,
    //   });

    //   if (response.ok) {
    //     setFormSuccess('¡Propiedad agregada con éxito!');
    //     // ... limpiar formulario
    //   } else {
    //     setFormError('Hubo un error al agregar la propiedad'); 
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   setFormError('Hubo un error al agregar la propiedad');
    // }
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
              name="titulo"
              placeholder="Titulo"
              value={formData.titulo}
              onChange={handleChange}
            />
            <input
              type="text"
              name="precio"
              placeholder="Precio"
              value={formData.precio}
              onChange={handleChange}
            />
            <input
              type="text"
              name="ubicacion"
              placeholder="Ubicación"
              value={formData.ubicacion}
              onChange={handleChange}
            />
            <div className={styles.horizontalFields}>
              <input
                type="number"
                name="recamaras"
                placeholder="Recamaras"
                value={formData.recamaras}
                onChange={handleChange}
                min="0"
              />
              <input
                type="number"
                name="banos"
                placeholder="Baños"
                value={formData.banos}
                onChange={handleChange}
                min="0"
              />
              <input
                type="number"
                name="metros"
                placeholder="m²"
                value={formData.metros}
                onChange={handleChange}
                min="0"
              />
            </div>
            <textarea
              name="detalles"
              placeholder="Detalles"
              value={formData.detalles}
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
