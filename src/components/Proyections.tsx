import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStatistics } from '../api/property';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { House, BarChart2, TrendingUp } from 'lucide-react';

interface MonthlyData {
  month: string;
  usuarios: number;
}

const UpdatedProjections = () => {
  const navigate = useNavigate();
  const [projectionData, setProjectionData] = useState<MonthlyData[]>([]);
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
        const monthlyData = response.data.usersRegisteredPerMonth;

        // Ordenar datos cronológicamente
        monthlyData.sort((a: any, b: any) => new Date(a._id).getTime() - new Date(b._id).getTime());

        // Calcular la diferencia promedio entre meses consecutivos
        let totalDifference = 0;
        for (let i = 1; i < monthlyData.length; i++) {
          totalDifference += (monthlyData[i].count - monthlyData[i - 1].count);
        }
        const averageMonthlyGrowth = totalDifference / (monthlyData.length - 1) || 0;

        // Crear proyecciones para los próximos 12 meses
        const projectedData = [];
        let lastCount = monthlyData[monthlyData.length - 1].count; // Último valor real
        let currentDate = new Date(monthlyData[monthlyData.length - 1]._id + '-01');

        for (let i = 0; i < 12; i++) {
          currentDate.setMonth(currentDate.getMonth() + 1);
          lastCount += averageMonthlyGrowth;
          projectedData.push({
            month: currentDate.toLocaleString('es-ES', { month: 'short', year: 'numeric' }),
            usuarios: Math.max(Math.round(lastCount), 0), // Asegurar no valores negativos
          });
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
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Proyecciones de Usuarios</h1>
        <ResponsiveContainer width="100%" height={500}>
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
            <Line type="monotone" dataKey="usuarios" stroke="#82ca9d" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UpdatedProjections;