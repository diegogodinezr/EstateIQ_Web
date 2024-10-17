import { useEffect, useState } from 'react';
import { getAdminStatistics } from '../api/property';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, ScatterChart, Scatter, Cell 
} from 'recharts';
import { DollarSign, Users, Home, Activity, Clock, Trash, MapPin } from 'lucide-react';

const COLORS = ['#f2b333', '#f2545b', '#30a46c', '#5c7cfa', '#8884d8', '#82ca9d', '#ffc658'];

interface StatisticsData {
  totalUsers: number;
  totalProperties: number;
  activePercentage: number;
  conversionRate: {
    conversionRate: number;
  };
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

const Statistics = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const propertyTypeData = statistics.propertyTypeDistribution.map(item => ({
    name: item._id,
    value: item.count
  }));

  const locationData = statistics.propertiesByLocation.map(loc => ({
    name: loc._id,
    value: loc.total,
  }));

  const avgPriceByTypeAndLocationData = statistics.avgPriceByTypeAndLocation.reduce((acc: any, curr) => {
    if (!acc[curr._id.type]) {
      acc[curr._id.type] = [];
    }
    acc[curr._id.type].push({
      location: curr._id.location,
      avgPrice: curr.avgPrice
    });
    return acc;
  }, {});

  const visitsByLocationData = statistics.visitsByLocation.map(item => ({
    name: item._id,
    averageVisits: item.averageVisits,
    totalCompleted: item.totalCompleted
  }));

  const deletedPropertiesData = statistics.deletedPropertiesStats.map(item => ({
    name: item._id,
    value: item.total
  }));

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Estadísticas de EstateIQ</h1>

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

        {/* Gráficos de ancho completo */}
        <div className="mt-8 space-y-8">
          {/* Propiedades por ubicación */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4 flex items-center">
              <MapPin className="mr-2" />
              Propiedades por Ubicación
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#f2b333" name="Cantidad de propiedades" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Precio promedio por tipo y ubicación */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4">Precio Promedio por Tipo y Ubicación</h2>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid />
                <XAxis type="category" dataKey="location" name="Ubicación" />
                <YAxis type="number" dataKey="avgPrice" name="Precio Promedio" unit="$" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                {Object.entries(avgPriceByTypeAndLocationData).map(([type, data], index) => (
                <Scatter 
                  key={type} 
                  name={type} 
                  data={Array.isArray(data) ? data : []} 
                  fill={COLORS[index % COLORS.length]} 
                />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Visitas por ubicación */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-yellow-500 mb-4">Visitas por Ubicación</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={visitsByLocationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#f2b333" />
                <YAxis yAxisId="right" orientation="right" stroke="#f2545b" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="averageVisits" fill="#f2b333" name="Visitas promedio" />
                <Bar yAxisId="right" dataKey="totalCompleted" fill="#f2545b" name="Total completadas" />
                </BarChart>
            </ResponsiveContainer>
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
    </div>
  );
};

export default Statistics;