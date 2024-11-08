import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Shield, 
  BarChart, 
  MapPin, 
  DollarSign,
  Star,
  ArrowRight,
  Bed,
  Bath,
  Square,
  Home,
  Building2,
  Landmark,
  Store,
  Phone,
  X,
  Eye
} from 'lucide-react';
import { getProperties, incrementPropertyViews } from '../api/property';
import casaImg from './a.png';

interface Property {
  _id: string;
  title: string;
  price: number;
  calleYNumero: string;
  colonia: string;
  codigoPostal: string;
  estado: string;
  municipio: string;
  bedrooms: number;
  bathrooms: number;
  squaremeters: number;
  description: string;
  images: string[];
  type: 'sale' | 'rent';
  propertyType: 'House' | 'Apartment' | 'Land' | 'Commercial';
  contactNumber: string;
  views: number;
}

const PropertyTypeIcon = ({ type }: { type: Property['propertyType'] }) => {
  switch (type) {
    case 'House':
      return <Home className="w-5 h-5" />;
    case 'Apartment':
      return <Building2 className="w-5 h-5" />;
    case 'Land':
      return <Landmark className="w-5 h-5" />;
    case 'Commercial':
      return <Store className="w-5 h-5" />;
    default:
      return <Home className="w-5 h-5" />;
  }
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="relative p-6 rounded-xl bg-white group hover:shadow-lg transition-all duration-300 border border-gray-100">
    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">{icon}</div>
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);
const PropertyCard: React.FC<{ 
    property: Property;
    onViewDetails: (property: Property) => void;
  }> = ({ property, onViewDetails }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={property.images?.length > 0 ? property.images[0] : 'https://via.placeholder.com/800x600'} 
          alt={property.title} 
          className="w-full h-80 object-cover"
        />
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
          property.type === 'sale' ? 'bg-yellow-500 text-white' : 'bg-yellow-500 text-white'
        }`}>
          {property.type === 'sale' ? 'Venta' : 'Renta'}
        </span>
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white text-gray-700 text-sm font-semibold flex items-center gap-1">
          <Eye size={16} />
          {property.views || 0}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <PropertyTypeIcon type={property.propertyType} />
          <h3 className="text-xl font-semibold">{property.title}</h3>
        </div>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{property.estado}, {property.municipio}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <DollarSign size={20} className="text-yellow-500" />
            <span className="text-xl font-bold text-yellow-500">
              {property.price.toLocaleString()}
              {property.type === 'rent' && '/mes'}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <Bed size={16} />
              {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath size={16} />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Square size={16} />
              {property.squaremeters}m²
            </span>
          </div>
        </div>
        <button 
          onClick={() => onViewDetails(property)}
          className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
  
  const PropertyModal: React.FC<{
    property: Property;
    onClose: () => void;
  }> = ({ property, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <button className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full" onClick={onClose}>
            <X size={24} />
          </button>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PropertyTypeIcon type={property.propertyType} />
                <h2 className="text-2xl font-bold">{property.title}</h2>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>{property.calleYNumero}, {property.colonia}, CP {property.codigoPostal}, {property.municipio}, {property.estado}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-500">
                ${property.price.toLocaleString()}
                {property.type === 'rent' && '/mes'}
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                property.type === 'sale' ? 'bg-yellow-500 text-white' : 'bg-yellow-500 text-white'
              }`}>
                {property.type === 'sale' ? 'Venta' : 'Renta'}
              </span>
            </div>
          </div>
  
          <img 
            src={property.images?.length > 0 ? property.images[0] : 'https://via.placeholder.com/800x600'} 
            alt={property.title}
            className="w-full h-96 object-cover rounded-xl mb-6"
          />
  
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Bed size={20} />
                <span className="font-semibold">{property.bedrooms}</span>
              </div>
              <span className="text-sm text-gray-600">Habitaciones</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Bath size={20} />
                <span className="font-semibold">{property.bathrooms}</span>
              </div>
              <span className="text-sm text-gray-600">Baños</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Square size={20} />
                <span className="font-semibold">{property.squaremeters}</span>
              </div>
              <span className="text-sm text-gray-600">m²</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Eye size={20} />
                <span className="font-semibold">{property.views || 0}</span>
              </div>
              <span className="text-sm text-gray-600">Visualizaciones</span>
            </div>
          </div>
  
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Descripción</h3>
            <p className="text-gray-600">{property.description}</p>
          </div>
  
          <div>
            <h3 className="text-xl font-semibold mb-3">Información de Contacto</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={20} />
              <span>{property.contactNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  

  const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
    useEffect(() => {
      const fetchFeaturedProperties = async () => {
        try {
          const response = await getProperties({});
          // Sort properties by views in descending order and take top 3
          const sortedProperties = response.data.sort((a: Property, b: Property) => 
            (b.views || 0) - (a.views || 0)
          ).slice(0, 3);
          setFeaturedProperties(sortedProperties);
        } catch (error) {
          console.error('Error al obtener propiedades destacadas:', error);
        }
      };
  
      fetchFeaturedProperties();
    }, []);
  
    const handleViewDetails = async (property: Property) => {
      try {
        const lastView = localStorage.getItem(`property-view-${property._id}`);
        const now = new Date().getTime();
        
        if (!lastView || (now - parseInt(lastView)) > 24 * 60 * 60 * 1000) {
          const response = await incrementPropertyViews(property._id);
          localStorage.setItem(`property-view-${property._id}`, now.toString());
          setSelectedProperty(response.data);
          
          setFeaturedProperties(featuredProperties.map(p => 
            p._id === property._id ? {...p, views: response.data.views} : p
          ));
        } else {
          setSelectedProperty(property);
        }
      } catch (error) {
        console.error('Error al abrir el modal:', error);
        setSelectedProperty(property);
      }
    };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent"></div>
        <div className="container mx-auto px-4 pt-32 pb-20 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-6xl font-bold mb-6 text-gray-800 leading-tight">
                Encuentra la propiedad de tus sueños
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Descubre miles de propiedades seleccionadas especialmente para ti.
              </p>
              <div className="flex gap-4">
                <button onClick={() => navigate('/home')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center group">
                  Explorar Propiedades
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/add-property')} className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50 px-8 py-4 rounded-lg font-semibold">
                  Publicar Propiedad
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={casaImg} alt="Modern House" className="w-full h-80 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">200+</div>
            <div className="text-gray-600">Propiedades Listadas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">4.8</div>
            <div className="text-gray-600">Calificación Promedio</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">200+</div>
            <div className="text-gray-600">Clientes Satisfechos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">24/7</div>
            <div className="text-gray-600">Soporte Disponible</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">¿Por qué elegir EstateIQ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma está diseñada para hacer tu búsqueda de propiedades más fácil y segura
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search size={24} />}
              title="Búsqueda Inteligente"
              description="Encuentra exactamente lo que buscas con nuestros filtros avanzados y recomendaciones personalizadas"
            />
            <FeatureCard
              icon={<Shield size={24} />}
              title="Propiedades Verificadas"
              description="Todas nuestras propiedades son verificadas minuciosamente para tu tranquilidad"
            />
            <FeatureCard
              icon={<BarChart size={24} />}
              title="Análisis de Mercado"
              description="Accede a estadísticas detalladas y tendencias del mercado inmobiliario en tiempo real"
            />
          </div>
        </div>
      </div>


        {/* Featured Properties Section */}
        <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Propiedades Más Populares</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
                Descubre nuestras propiedades más visitadas seleccionadas especialmente para ti
            </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
                <PropertyCard 
                key={property._id} 
                property={property}
                onViewDetails={handleViewDetails}
                />
            ))}
            </div>
        </div>

        {/* Modal */}
        {selectedProperty && (
            <PropertyModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            />
        )}

      {/* CTA Section */}
      <div className="bg-yellow-500">
        <div className="container mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-100 opacity-50 transform -skew-x-12"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h2 className="text-3xl font-bold mb-4">¿Listo para encontrar tu hogar ideal?</h2>
                <p className="text-gray-600 text-lg">
                  Miles de propiedades te esperan. Comienza tu búsqueda ahora y encuentra el lugar perfecto.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/home')} className="bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                  Explorar Propiedades
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experiencias reales de personas que encontraron su propiedad ideal con EstateIQ
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              "Encontré mi casa ideal en menos de dos semanas. La plataforma es muy intuitiva y el equipo de soporte siempre estuvo disponible para ayudarme."
            </p>
            <div className="flex items-center">
              <div>
                <h4 className="font-semibold">Carlos Ramírez</h4>
                <p className="text-gray-500 text-sm">Comprador Verificado</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              "Como agente inmobiliario, EstateIQ me ha permitido llegar a más clientes potenciales. La plataforma es muy profesional y fácil de usar."
            </p>
            <div className="flex items-center">
              <div>
                <h4 className="font-semibold">Ana Martínez</h4>
                <p className="text-gray-500 text-sm">Agente Inmobiliario</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              "El proceso de publicar mi propiedad fue muy sencillo y rápido. Vendí en menos tiempo del esperado y a un excelente precio."
            </p>
            <div className="flex items-center">
              <div>
                <h4 className="font-semibold">Laura Torres</h4>
                <p className="text-gray-500 text-sm">Vendedor Verificado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">EstateIQ</h3>
              <p className="text-gray-400">
                Tu plataforma inmobiliaria de confianza para encontrar la propiedad perfecta.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500">Inicio</a></li>
                <li><a href="#" className="hover:text-yellow-500">Propiedades</a></li>
                <li><a href="#" className="hover:text-yellow-500">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#/home" className="hover:text-yellow-500">Comprar</a></li>
                <li><a href="#/home" className="hover:text-yellow-500">Vender</a></li>
              <li><a href="#/home" className="hover:text-yellow-500">Rentar</a></li>
              <li><a href="#/home" className="hover:text-yellow-500">Avalúos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>contact@estateiq.com</li>
              <li>+52 (312) 128-2391</li>
              <li>Colima, Colima</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} EstateIQ. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
);
};

export default LandingPage;