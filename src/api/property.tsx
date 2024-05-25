import axios from 'axios';

const API = 'http://localhost:3000/api';

export const addPropertyRequest = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API}/properties`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response; // Devuelve la respuesta del backend
  } catch (error) {
    console.error('Error al agregar propiedad:', error);
    throw error; // Propaga el error para que pueda ser manejado por el frontend
  }
};

export const getProperties = async () => {
  try {
    const response = await axios.get(`${API}/properties`);
    return response; // Devuelve la respuesta del backend
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    throw error; // Propaga el error para que pueda ser manejado por el frontend
  }
};