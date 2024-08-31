import axios from 'axios';

const API = 'http://localhost:3000/api';

// Función para agregar una propiedad
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

// Función para obtener propiedades con filtros opcionales
export const getProperties = async (filters: {
  type?: 'all' | 'sale' | 'rent';
  propertyType?: string;
  location?: string;
  minPrice?: number | '';
  maxPrice?: number | '';
}) => {
  try {
    const { type, propertyType, location, minPrice, maxPrice } = filters;
    
    // Construir el objeto de parámetros de la consulta
    const params: any = {};
    if (type && type !== 'all') params.type = type;
    if (propertyType) params.propertyType = propertyType;
    if (location) params.location = location;
    if (minPrice !== undefined && minPrice !== '') params.minPrice = minPrice;
    if (maxPrice !== undefined && maxPrice !== '') params.maxPrice = maxPrice;

    const response = await axios.get(`${API}/properties`, { params });
    return response; // Devuelve la respuesta del backend
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    throw error; // Propaga el error para que pueda ser manejado por el frontend
  }
};
