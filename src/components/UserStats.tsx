import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStatistics } from '../api/property';

import {BarChart2, TrendingUp, House, List, Building, UserCircle } from 'lucide-react';


interface StatisticsData {
  totalUsers: number;
  totalProperties: number;
  activePercentage: number;
  conversionRate: {
    conversionRate: number;
  };
  usersRegisteredPerMonth: Array<{
    _id: string;
    count: number;
  }>;
  propertyTypeDistribution: Array<{
    _id: string;
    count: number;
  }>;
  propertiesByLocation: Array<{
    _id: string;
    total: number;
  }>;  
  mostViewedProperties: Array<{
    title: string;
    views: number;
  }>;
  avgPriceByTypeAndLocation: Array<{
    _id: {
      type: string;
      location: string;
    };
    avgPrice: number;
  }>;
  mostActiveUsers: Array<{
    email: string;
    propertyCount: number;
  }>;
  averageTimeOnMarketCompleted: number;
  averageTimeOnMarketCancelled: number;
  completionPercentage: number;
  cancellationPercentage: number;
  visitsByLocation: Array<{
    _id: string;
    averageVisits: number;
    totalCompleted: number;
  }>;
  deletedPropertiesStats: Array<{
    _id: string;
    total: number;
  }>;
  propertiesForSale: number;
  propertiesForRent: number;
  userActivity: {
    totalUsers: number;
    usersWithProperties: number;
  };
}
interface ProcessedPriceData {
  location: string;
  [key: string]: string | number; // Para permitir propiedades dinámicas de tipos de propiedad
}
const Statistics3 = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'propiedades' | 'usuarios'>('usuarios');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getAdminStatistics();
        setStatistics(response.data);
      } catch (err) {
        setError('Error al obtener estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Navigation handlers
  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleStatisticsClick = () => {
    // Current page, do nothing or refresh
    navigate('/statistics');
  };

  const handleProjectionsClick = () => {
    // Navigate to projections page
    navigate('/projections');
  };
 // New tab navigation handlers
 const handleGeneralClick = () => {
    setActiveTab('general');
    navigate('/statistics');
  };

  const handlePropertiesClick = () => {
    setActiveTab('propiedades');
    navigate('/statistics2');
  };

  const handleUsersClick = () => {
    setActiveTab('usuarios');
    navigate('/statistics3');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-red-500 text-center">{error}</h2>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-700 text-center">No se pudieron cargar las estadísticas.</h2>
      </div>
    );
  }
  statistics.avgPriceByTypeAndLocation.reduce<ProcessedPriceData[]>((acc, curr) => {
    const location = curr._id.location;
    const existingLocationIndex = acc.findIndex(item => item.location === location);
    
    if (existingLocationIndex === -1) {
      // Si la ubicación no existe, crear nuevo objeto
      acc.push({
        location,
        [curr._id.type]: curr.avgPrice
      });
    } else {
      // Si la ubicación existe, actualizar el objeto existente
      acc[existingLocationIndex] = {
        ...acc[existingLocationIndex],
        [curr._id.type]: curr.avgPrice
      };
    }
    return acc;
  }, []);
  
  return (
    <div className="bg-gray-100 min-h-screen">
{/* Navigation Bar */}
    <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-center space-x-4">
          <button 
            onClick={handleHomeClick}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
          >
            <House className="mr-2" />
            Inicio
          </button>
          <button 
            onClick={handleStatisticsClick}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-300 focus:outline-none"
          >
            <BarChart2 className="mr-2" />
            Estadísticas
          </button>
          <button 
            onClick={handleProjectionsClick}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 focus:outline-none"
          >
            <TrendingUp className="mr-2" />
            Proyecciones
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Estadísticas de EstateIQ</h1>
                 {/* New Statistics Sub-Navigation */}
                 <div className="flex justify-center space-x-4 mb-8">
          <button 
            onClick={handleGeneralClick}
            className={`flex items-center px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
              activeTab === 'general' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-yellow-100'
            }`}
          >
            <List className="mr-2" />
            Generales
          </button>
          <button 
            onClick={handlePropertiesClick}
            className={`flex items-center px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
              activeTab === 'propiedades' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-yellow-100'
            }`}
          >
            <Building className="mr-2" />
            Propiedades
          </button>
          <button 
            onClick={handleUsersClick}
            className={`flex items-center px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
              activeTab === 'usuarios' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-yellow-100'
            }`}
          >
            <UserCircle className="mr-2" />
            Usuarios
          </button>
        </div>
          {/* Usuarios más activos */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4">Usuarios Más Activos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propiedades Publicadas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statistics.mostActiveUsers.map((user) => (
                    <tr key={user.email}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.propertyCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
                  <br />
                  <br />
          {/* Propiedades más vistas */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4">Propiedades Más Vistas</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vistas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statistics.mostViewedProperties.map((property) => (
                    <tr key={property.title}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Statistics3;