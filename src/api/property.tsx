import axios from 'axios';

const API = 'https://estate-iq-backend.vercel.app/api';

// Configurar axios para incluir cookies automáticamente en las solicitudes
axios.defaults.withCredentials = true;

// Función para agregar una propiedad
export const addPropertyRequest = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API}/properties`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response; // Devuelve la respuesta del backend
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

    const response = await axios.get(`${API}/properties`, {
      params,
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    throw error;
  }
};

// Función para eliminar una propiedad por ID
export const deleteProperty = async (propertyId: string) => {
  try {
    const response = await axios.delete(`${API}/properties/${propertyId}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al eliminar propiedad:', error);
    throw error;
  }
};

// Función para modificar una propiedad por ID
export const updateProperty = async (propertyId: string, formData: FormData) => {
  try {
    const response = await axios.put(`${API}/properties/${propertyId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al modificar propiedad:', error);
    throw error;
  }
};

// Función para registrar un nuevo usuario
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

// Función para iniciar sesión de un usuario
export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API}/login`, userData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al iniciar sesión del usuario:', error);
    throw error;
  }
};

// Función para cerrar sesión del usuario
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API}/logout`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al cerrar sesión del usuario:', error);
    throw error;
  }
};

// Función para obtener el perfil del usuario (incluye el rol)
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API}/profile`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    throw error;
  }
};

// Función para obtener las estadísticas generales para administradores
export const getAdminStatistics = async () => {
  try {
    const response = await axios.get(`${API}/admin/statistics`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al obtener estadísticas del administrador:', error);
    throw error;
  }
};

// Función para obtener estadísticas detalladas (como propiedades más solicitadas)
export const getDetailedStatistics = async () => {
  try {
    const response = await axios.get(`${API}/admin/detailed-statistics`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error al obtener estadísticas detalladas:', error);
    throw error;
  }
};
