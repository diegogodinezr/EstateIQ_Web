import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStatistics } from '../api/property';

import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

import { 
  DollarSign, Users, Home, Activity, Clock, Trash, 
  UserPlus, BarChart2, TrendingUp, House, List, Building, UserCircle 
} from 'lucide-react';

const COLORS = ['#f2b333', '#f2545b', '#30a46c', '#5c7cfa', '#8884d8', '#82ca9d', '#ffc658'];

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
// Función para formatear los meses en español
const formatMonth = (monthStr: string) => {
  const months: { [key: string]: string } = {
    '01': 'Enero', '02': 'Febrero', '03': 'Marzo', 
    '04': 'Abril', '05': 'Mayo', '06': 'Junio',
    '07': 'Julio', '08': 'Agosto', '09': 'Septiembre', 
    '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
  };
  return months[monthStr.split('-')[1]] || monthStr;
};
const Statistics = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'propiedades' | 'usuarios'>('general');

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
    navigate('/statistics');
  };

  const handleProjectionsClick = () => {
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


  const monthlyRegistrationData = statistics.usersRegisteredPerMonth.map(item => ({
    month: item._id,
    usuarios: item.count
  }));

  const propertyTypeData = statistics.propertyTypeDistribution.map(item => ({
    name: item._id,
    value: item.count
  }));

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

  const deletedPropertiesData = statistics.deletedPropertiesStats.map(item => ({
    name: item._id,
    value: item.total
  }));

  
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
       {/* Usuarios Registrados por Mes */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 mb-8">
          <h2 className="text-xl font-semibold text-yellow-500 mb-4 flex items-center">
            <UserPlus className="mr-2" />
            Usuarios Registrados por Mes
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={monthlyRegistrationData.map(item => ({
                month: formatMonth(item.month),
                usuarios: item.usuarios
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e0e0e0"
              />
              <XAxis 
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                label={{ 
                  value: 'Número de Usuarios', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -10,
                  fontSize: 12
                }}
                tickFormatter={(value) => Math.round(value).toLocaleString()}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 border rounded shadow-lg">
                        <p className="font-bold text-yellow-600">{label}</p>
                        <p className="text-gray-700">
                          Usuarios Registrados: 
                          <span className="ml-2 font-semibold">{payload[0].value}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
              />
              <Line 
                type="monotone" 
                dataKey="usuarios" 
                stroke="#f2b333" 
                strokeWidth={3}
                name="Usuarios Registrados"
                activeDot={{ 
                  r: 8,
                  stroke: '#f2b333',
                  strokeWidth: 2,
                  fill: 'white'
                }}
                dot={{ 
                  stroke: '#f2b333', 
                  strokeWidth: 2,
                  fill: '#f2b333'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resumen General */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4 flex items-center">
              <Activity className="mr-2" />
              Resumen General
            </h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="flex items-center text-gray-600"><Users className="mr-2" /> Total de usuarios:</span>
                <span className="font-semibold text-gray-800">{statistics.totalUsers}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="flex items-center text-gray-600"><Home className="mr-2" /> Total de propiedades:</span>
                <span className="font-semibold text-gray-800">{statistics.totalProperties}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="flex items-center text-gray-600"><Activity className="mr-2" /> Propiedades activas:</span>
                <span className="font-semibold text-gray-800">{statistics.activePercentage.toFixed(2)}%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="flex items-center text-gray-600"><DollarSign className="mr-2" /> Tasa de conversión:</span>
                <span className="font-semibold text-gray-800">{statistics.conversionRate.conversionRate.toFixed(2)}%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="flex items-center text-gray-600"><Home className="mr-2" /> En venta:</span>
                <span className="font-semibold text-gray-800">{statistics.propertiesForSale}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="flex items-center text-gray-600"><Home className="mr-2" /> En renta:</span>
                <span className="font-semibold text-gray-800">{statistics.propertiesForRent}</span>
              </li>
            </ul>
          </div>

          {/* Distribución de tipos de propiedades */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4 flex items-center">
              <Home className="mr-2" />
              Tipos de Propiedades
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                {propertyTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tiempo promedio en el mercado */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4 flex items-center">
              <Clock className="mr-2" />
              Tiempo Promedio en el Mercado (Días)
            </h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Completadas:</span>
                <span className="font-semibold text-gray-800">
                  {Math.round(statistics.averageTimeOnMarketCompleted / (1000 * 60 * 60 * 24))}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Canceladas:</span>
                <span className="font-semibold text-gray-800">
                  {Math.round(statistics.averageTimeOnMarketCancelled / (1000 * 60 * 60 * 24))}
                </span>
              </li>
            </ul>
          </div>

          {/* Tasa de completación/cancelación */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4 flex items-center">
              <Activity className="mr-2" />
              Tasa de Completación/Cancelación
            </h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Tasa de completadas:</span>
                <span className="font-semibold text-gray-800">{statistics.completionPercentage.toFixed(2)}%</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Tasa de canceladas:</span>
                <span className="font-semibold text-gray-800">{statistics.cancellationPercentage.toFixed(2)}%</span>
              </li>
            </ul>
          </div>

          {/* Propiedades eliminadas por motivo */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4 flex items-center">
              <Trash className="mr-2" />
              Propiedades Eliminadas por Motivo
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deletedPropertiesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                {deletedPropertiesData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Actividad de usuarios */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4">Actividad de Usuarios</h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Total de usuarios:</span>
                <span className="font-semibold text-gray-800">{statistics.userActivity.totalUsers}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Usuarios con propiedades:</span>
                <span className="font-semibold text-gray-800">{statistics.userActivity.usersWithProperties}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Porcentaje de usuarios activos:</span>
                <span className="font-semibold text-gray-800">
                  {((statistics.userActivity.usersWithProperties / statistics.userActivity.totalUsers) * 100).toFixed(2)}%
                </span>
              </li>
            </ul>
          </div>
        </div>
          </div>
        </div>
  );
};

export default Statistics;