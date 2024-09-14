import axios from 'axios';

const API = 'http://localhost:3000/api';

// Configurar axios para incluir cookies automáticamente en las solicitudes
axios.defaults.withCredentials = true;

// Función para agregar una propiedad
export const addPropertyRequest = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API}/properties`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // Asegúrate de incluir esto para enviar cookies
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
    
    const params: any = {};
    if (type && type !== 'all') params.type = type;
    if (propertyType) params.propertyType = propertyType;
    if (location) params.location = location;
    if (minPrice !== undefined && minPrice !== '') params.minPrice = minPrice;
    if (maxPrice !== undefined && maxPrice !== '') params.maxPrice = maxPrice;

    const response = await axios.get(`${API}/properties`, {
      params,
      withCredentials: true, // Asegúrate de incluir esto para enviar cookies
    });
    return response; // Devuelve la respuesta del backend
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    throw error; // Propaga el error para que pueda ser manejado por el frontend
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API}/register`, userData, {
      withCredentials: true, // Asegúrate de incluir esto para enviar cookies
    });
    return response; // Devuelve la respuesta del backend
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error; // Propaga el error para que pueda ser manejado por el frontend
  }
};

// Función para iniciar sesión de un usuario
export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API}/login`, userData, {
      withCredentials: true, // Asegúrate de incluir esto para enviar cookies
    });
    return response; // Devuelve la respuesta del backend
  } catch (error) {
    console.error('Error al iniciar sesión del usuario:', error);
    throw error; // Propaga el error para que pueda ser manejado por el frontend
  }
};

// Función para cerrar sesión del usuario
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API}/logout`, {
      withCredentials: true, // Asegúrate de incluir esto para enviar cookies
    });
    return response; // Devuelve la respuesta del backend
  } catch (error) {
    console.error('Error al cerrar sesión del usuario:', error);
    throw error; // Propaga el error para que pueda ser manejado por el frontend
  }
};

// Función para obtener el perfil del usuario
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API}/profile`, {
      withCredentials: true, // Asegúrate de incluir esto para enviar cookies
    });
    return response; // Devuelve la respuesta del backend
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    throw error; // Propaga el error para que pueda ser manejado por el frontend
  }
};
