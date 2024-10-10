import axios, { AxiosResponse } from 'axios';

// Types
interface UserData {
  email: string;
  password: string;
}

interface PropertyFilters {
  type?: 'all' | 'sale' | 'rent';
  propertyType?: string;
  location?: string;
  minPrice?: number | '';
  maxPrice?: number | '';
}

// API Configuration
//const API = 'https://estate-iq-backend.vercel.app/api';
const API = 'http://localhost:3000/api';

axios.defaults.baseURL = API;

// Función para obtener el token
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Función para configurar el token en el header
const setAuthHeader = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      setAuthHeader(null);
      window.dispatchEvent(new CustomEvent('logout'));
    }
    return Promise.reject(error);
  }
);

export const addPropertyRequest = async (formData: FormData): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(`${API}/properties`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response;
  } catch (error) {
    console.error('Error al agregar propiedad:', error);
    throw error;
  }
};

export const getProperties = async (filters: PropertyFilters): Promise<AxiosResponse> => {
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

export const getPropertyById = async (propertyId: string): Promise<AxiosResponse> => {
  try {
    const response = await axios.get(`${API}/properties/${propertyId}`);
    return response;
  } catch (error) {
    console.error('Error al obtener la propiedad:', error);
    throw error;
  }
};

export const deleteProperty = async (propertyId: string, deleteReason: string): Promise<AxiosResponse> => {
  try {
    const response = await axios.delete(`${API}/properties/${propertyId}`, {
      data: { deleteReason } // Pasar el motivo de eliminación en el body
    });
    return response;
  } catch (error) {
    console.error('Error al eliminar propiedad:', error);
    throw error;
  }
};

export const updateProperty = async (propertyId: string, formData: FormData): Promise<AxiosResponse> => {
  try {
    const response = await axios.put(`${API}/properties/${propertyId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response;
  } catch (error) {
    console.error('Error al modificar propiedad:', error);
    throw error;
  }
};

export const registerUser = async (userData: UserData): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(`${API}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      setAuthHeader(response.data.token);
    }
    return response;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

export const loginUser = async (userData: UserData): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(`${API}/login`, userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      setAuthHeader(response.data.token);
    }
    return response;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await axios.post(`${API}/logout`);
  } finally {
    localStorage.removeItem('authToken');
    setAuthHeader(null);
  }
};

export const getProfile = async (): Promise<AxiosResponse | null> => {
  const token = getToken();
  if (!token) {
    console.error('No se encontró el token de autenticación.');
    return null;
  }

  try {
    const response = await axios.get(`${API}/profile`);
    return response;
  } catch (error) {
    console.error('Error al obtener perfil del usuario:', error);
    throw error;
  }
};

export const getAdminStatistics = async (): Promise<AxiosResponse> => {
  try {
    const response = await axios.get(`${API}/statistics`);
    return response;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

export const getDetailedStatistics = async (): Promise<AxiosResponse> => {
  try {
    const response = await axios.get(`${API}/detailed-statistics`);
    return response;
  } catch (error) {
    console.error('Error al obtener estadísticas detalladas:', error);
    throw error;
  }
};

// Inicializar el token si existe en localStorage cuando se carga la aplicación
const token = getToken();
if (token) {
  setAuthHeader(token);
}
export const incrementPropertyViews = async (propertyId: string): Promise<AxiosResponse> => {
  try {
    const response = await axios.get(`${API}/properties/${propertyId}`);
    return response;
  } catch (error) {
    console.error('Error al incrementar vistas de la propiedad:', error);
    throw error;
  }
};
