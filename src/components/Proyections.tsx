import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStatistics } from '../api/property';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { House, BarChart2, TrendingUp } from 'lucide-react';

interface MonthlyProjectionData {
  month: string;
  usuarios?: number;
  completedProperties?: number;
  propertiesForSale?: number;
  propertiesForRent?: number;
  activePropertyPercentage?: number;
  conversionRate?: number;
  usersWithProperties?: number;
  completionRate?: number;
  cancellationRate?: number;
  [key: string]: number | string | undefined; // Added to allow dynamic key assignment
}

const UpdatedProjections = () => {
  const navigate = useNavigate();
  const [projectionData, setProjectionData] = useState<MonthlyProjectionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchProjections = async () => {
      try {
        const response = await getAdminStatistics();
        const monthlyUserData = response.data.usersRegisteredPerMonth;
        const deletedPropertiesStats = response.data.deletedPropertiesStats;
        const statistics = response.data;

        // Sorting and basic calculations
        monthlyUserData.sort((a: any, b: any) => new Date(a._id).getTime() - new Date(b._id).getTime());

        // Calculation helpers
        const calculateAverage = (data: any[], accessor: (item: any) => number) => {
          if (data.length <= 1) return 0;
          let total = 0;
          for (let i = 1; i < data.length; i++) {
            total += accessor(data[i]) - accessor(data[i-1]);
          }
          return total / (data.length - 1);
        };

        // Calculate averages and current values
        const averageMonthlyUserGrowth = calculateAverage(monthlyUserData, (item) => item.count);
        const completedPropertiesCount = deletedPropertiesStats.find((stat: any) => stat._id === 'completed')?.total || 0;
        const averageMonthlyCompletedPropertiesGrowth = completedPropertiesCount / monthlyUserData.length;

        // Current values for projection
        const currentValues = {
          propertiesForSale: statistics.propertiesForSale,
          propertiesForRent: statistics.propertiesForRent,
          activePropertyPercentage: statistics.activePercentage,
          conversionRate: statistics.conversionRate.conversionRate,
          usersWithProperties: statistics.userActivity.usersWithProperties,
          completionRate: statistics.completionPercentage,
          cancellationRate: statistics.cancellationPercentage
        };

        // Projection function
        const projectMetric = (currentValue: number, averageGrowth: number) => {
          return Math.max(Math.round(currentValue * (1 + (averageGrowth / currentValue))), 0);
        };

        // Create projections for the next 12 months
        const projectedData: MonthlyProjectionData[] = [];
        let lastUserCount = monthlyUserData[monthlyUserData.length - 1].count;
        let lastCompletedPropertiesCount = completedPropertiesCount;
        let currentDate = new Date(monthlyUserData[monthlyUserData.length - 1]._id + '-01');

        // Metrics to project
        const projectionMetrics = [
          { key: 'propertiesForSale', label: 'Propiedades en Venta' },
          { key: 'propertiesForRent', label: 'Propiedades en Renta' },
          { key: 'activePropertyPercentage', label: 'Porcentaje de Propiedades Activas' },
          { key: 'conversionRate', label: 'Tasa de Conversión' },
          { key: 'usersWithProperties', label: 'Usuarios con Propiedades' },
          { key: 'completionRate', label: 'Tasa de Completación' },
          { key: 'cancellationRate', label: 'Tasa de Cancelación' }
        ];

        // Project metrics for 12 months
        for (let i = 0; i < 12; i++) {
          currentDate.setMonth(currentDate.getMonth() + 1);
          
          // Project users and completed properties
          lastUserCount += averageMonthlyUserGrowth;
          lastCompletedPropertiesCount += averageMonthlyCompletedPropertiesGrowth;

          // Create monthly projection object
          const monthProjection: MonthlyProjectionData = {
            month: currentDate.toLocaleString('es-ES', { month: 'short', year: 'numeric' }),
            usuarios: Math.max(Math.round(lastUserCount), 0),
            completedProperties: Math.max(Math.round(lastCompletedPropertiesCount), 0)
          };

          // Project additional metrics
          projectionMetrics.forEach(metric => {
            // Use bracket notation to allow dynamic key assignment
            (monthProjection as any)[metric.key] = projectMetric(
              currentValues[metric.key as keyof typeof currentValues], 
              averageMonthlyUserGrowth
            );
          });

          projectedData.push(monthProjection);
        }

        setProjectionData(projectedData);
      } catch (err) {
        setError('Error al obtener proyecciones');
      } finally {
        setLoading(false);
      }
    };

    fetchProjections();
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

  return (
    <div className="bg-gray-100 min-h-screen">
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
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Proyecciones Detalladas de EstateIQ
        </h1>
        
        {/* Users and Completed Properties Projection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Usuarios y Propiedades Completadas
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="usuarios" 
                stroke="#82ca9d" 
                strokeWidth={3} 
                name="Usuarios Proyectados"
              />
              <Line 
                type="monotone" 
                dataKey="completedProperties" 
                stroke="#f2b333" 
                strokeWidth={3} 
                name="Propiedades Completadas Proyectadas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Visualization Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Combined Performance Metrics */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
              Métricas de Desempeño
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)', 
                    borderRadius: '10px' 
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversionRate" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Tasa de Conversión (%)"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completionRate" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Tasa de Completación (%)"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cancellationRate" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  name="Tasa de Cancelación (%)"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Property Distribution */}
          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
              Distribución de Propiedades
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)', 
                    borderRadius: '10px' 
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="propertiesForSale" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Propiedades en Venta"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="propertiesForRent" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Propiedades en Renta"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="activePropertyPercentage" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  name="% Propiedades Activas"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatedProjections;