//archivo para conectarse al backend
import axios from 'axios';

//const API = 'https://estate-iq-backend.vercel.app/api';
const API = 'http://localhost:3000/api';

// Configurar axios para incluir cookies automáticamente en las solicitudes
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000/api';
const getToken = () => {
  return localStorage.getItem('authToken'); // Obtén el token de autenticación
};

// Función para agregar una propiedad
export const addPropertyRequest = async (formData: FormData) => {
  const token = getToken();
  try {
    const response = await axios.post(`${API}/properties`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, // Agrega el token al header
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al agregar propiedad:', error);
    throw error;
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

    const response = await axios.get(`${API}/properties`, { params });
    return response;
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    throw error;
  }
};

// Función para eliminar una propiedad
export const deleteProperty = async (propertyId: string) => {
  const token = getToken();
  try {
    const response = await axios.delete(`${API}/properties/${propertyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Agrega el token al header
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al eliminar propiedad:', error);
    throw error;
  }
};

// Función para modificar una propiedad
export const updateProperty = async (propertyId: string, formData: FormData) => {
  const token = getToken();
  try {
    const response = await axios.put(`${API}/properties/${propertyId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, // Agrega el token al header
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al modificar propiedad:', error);
    throw error;
  }
};

// Función para registrar un usuario
export const registerUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API}/register`, userData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

// Función para iniciar sesión
export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API}/login`, userData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Función para cerrar sesión
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API}/logout`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

// Función para obtener el perfil del usuario
export const getProfile = async () => {
  const token = getToken();
  if (!token) {
    console.error('No se encontró el token de autenticación.');
    return null; // Si no hay token, evita hacer la solicitud
  }

  try {
    const response = await axios.get(`${API}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Agrega el token al header
      },
      withCredentials: true,
    });

    if (response.status === 200 && response.data) {
      return response.data; // Asegúrate de devolver los datos completos
    } else {
      console.error('Error inesperado en la respuesta:', response);
      return null;
    }
  } catch (error) {
    console.error('Error al obtener perfil del usuario:', error);
    throw error;
  }
};

// Función para obtener estadísticas de admin
export const getAdminStatistics = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${API}/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Agrega el token al header
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

// Función para obtener estadísticas detalladas
export const getDetailedStatistics = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${API}/detailed-statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Agrega el token al header
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al obtener estadísticas detalladas:', error);
    throw error;
  }
};
