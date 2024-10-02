import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import PropertyListing from './Home'; // Asegúrate de que la ruta sea correcta
import AddProperty from './AddProperty'; // Asegúrate de que la ruta sea correcta
import { getProperties, addPropertyRequest } from '../api/property';
import { vi } from 'vitest'; // Asegúrate de que Vitest esté correctamente instalado y configurado

// Mockea las funciones getProperties y addPropertyRequest
vi.mock('../api/property');
const mockGetProperties = getProperties as jest.MockedFunction<typeof getProperties>;
const mockAddPropertyRequest = addPropertyRequest as jest.MockedFunction<typeof addPropertyRequest>;

const mockProperties = [
  {
    _id: '1',
    title: 'Casa 1',
    price: 50000,
    location: 'Colima',
    bedrooms: 5,
    bathrooms: 3,
    squaremeters: 120,
    description: 'Casa bonita',
    images: ['/path/to/image1.jpg'],
  },
  {
    _id: '2',
    title: 'Casa 2',
    price: 75000,
    location: 'Guadalajara',
    bedrooms: 4,
    bathrooms: 2,
    squaremeters: 150,
    description: 'Casa grande',
    images: ['/path/to/image2.jpg'],
  },
];

const mockResponse = {
  data: mockProperties,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

describe('PropertyListing Component', () => {
  beforeEach(() => {
    mockGetProperties.mockResolvedValue(Promise.resolve(mockResponse) as any);
  });

  test('recupera y muestra las propiedades correctamente', async () => {
    render(
      <Router>
        <PropertyListing />
      </Router>
    );

    // Espera a que los elementos de las propiedades aparezcan en el documento
    await waitFor(() => {
      expect(screen.getByText('Casa 1')).toBeInTheDocument();
      expect(screen.getByText('Casa 2')).toBeInTheDocument();
    });

    // Verifica que los elementos se muestren correctamente
    expect(screen.getByText('Casa 1')).toBeInTheDocument();
    expect(screen.getByText('Precio: $50000')).toBeInTheDocument();
    expect(screen.getByText('Ubicación: Colima')).toBeInTheDocument();
    expect(screen.getByText('Recámaras: 5')).toBeInTheDocument();
    expect(screen.getByText('Baños: 3')).toBeInTheDocument();
    expect(screen.getByText('Metros cuadrados: 120')).toBeInTheDocument();
    expect(screen.getByText('Casa bonita')).toBeInTheDocument();
    expect(screen.getByText('Casa 2')).toBeInTheDocument();
    expect(screen.getByText('Precio: $75000')).toBeInTheDocument();
    expect(screen.getByText('Ubicación: Guadalajara')).toBeInTheDocument();
    expect(screen.getByText('Recámaras: 4')).toBeInTheDocument();
    expect(screen.getByText('Baños: 2')).toBeInTheDocument();
    expect(screen.getByText('Metros cuadrados: 150')).toBeInTheDocument();
    expect(screen.getByText('Casa grande')).toBeInTheDocument();

    // Verifica que las imágenes se muestren correctamente
    const images = screen.getAllByRole('img');
    const image1 = images[0];
    const image2 = images[1];
    expect(image1).toHaveAttribute('src', '/path/to/image1.jpg');
    expect(image2).toHaveAttribute('src', '/path/to/image2.jpg');
  });
});

describe('AddProperty Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('envía los datos del formulario correctamente', async () => {
    // Mock de la respuesta de addPropertyRequest
    mockAddPropertyRequest.mockResolvedValue({ status: 201 });

    render(
      <Router>
        <AddProperty />
      </Router>
    );

    // Rellenar el formulario
    fireEvent.change(screen.getByPlaceholderText(/Titulo/i), { target: { value: 'Casa Bonita' } });
    fireEvent.change(screen.getByPlaceholderText(/Precio/i), { target: { value: '500000' } });
    fireEvent.change(screen.getByPlaceholderText(/Ubicación/i), { target: { value: 'Ciudad' } });
    fireEvent.change(screen.getByPlaceholderText(/Recamaras/i), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText(/Baños/i), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText(/m²/i), { target: { value: '120' } });
    fireEvent.change(screen.getByPlaceholderText(/Detalles/i), { target: { value: 'Hermosa casa en la ciudad.' } });

    // Simular la subida de una imagen
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Imagen:/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    // Enviar el formulario
    fireEvent.click(screen.getByText(/Publicar/i));

    await waitFor(() => {
      // Verificar que addPropertyRequest haya sido llamada correctamente
      expect(mockAddPropertyRequest).toHaveBeenCalledTimes(1);
      const formData = (mockAddPropertyRequest as jest.Mock).mock.calls[0][0] as FormData;
      expect(formData.get('title')).toBe('Casa Bonita');
      expect(formData.get('price')).toBe('500000');
      expect(formData.get('location')).toBe('Ciudad');
      expect(formData.get('bedrooms')).toBe('3');
      expect(formData.get('bathrooms')).toBe('2');
      expect(formData.get('squaremeters')).toBe('120');
      expect(formData.get('description')).toBe('Hermosa casa en la ciudad.');
      expect(formData.get('images')).toBeInstanceOf(File);
    });

    // Verificar que el mensaje de éxito se muestre
    expect(screen.getByText('¡Propiedad agregada con éxito!')).toBeInTheDocument();
  });
});


describe('AddProperty Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('envía los datos del formulario correctamente', async () => {
    // Mock de la respuesta de addPropertyRequest
    mockAddPropertyRequest.mockResolvedValue({ status: 201 });

    render(
      <Router>
        <AddProperty />
      </Router>
    );

    // Rellenar el formulario
    fireEvent.change(screen.getByPlaceholderText(/Titulo/i), { target: { value: 'Casa Bonita' } });
    fireEvent.change(screen.getByPlaceholderText(/Precio/i), { target: { value: '500000' } });
    fireEvent.change(screen.getByPlaceholderText(/Ubicación/i), { target: { value: 'Ciudad' } });
    fireEvent.change(screen.getByPlaceholderText(/Recamaras/i), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText(/Baños/i), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText(/m²/i), { target: { value: '120' } });
    fireEvent.change(screen.getByPlaceholderText(/Detalles/i), { target: { value: 'Hermosa casa en la ciudad.' } });

    // Simular la subida de una imagen
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Imagen:/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    // Enviar el formulario
    fireEvent.click(screen.getByText(/Publicar/i));

    await waitFor(() => {
      // Verificar que addPropertyRequest haya sido llamada correctamente
      expect(mockAddPropertyRequest).toHaveBeenCalledTimes(1);
      const formData = (mockAddPropertyRequest as vi.Mock).mock.calls[0][0] as FormData;
      expect(formData.get('title')).toBe('Casa Bonita');
      expect(formData.get('price')).toBe('500000');
      expect(formData.get('location')).toBe('Ciudad');
      expect(formData.get('bedrooms')).toBe('3');
      expect(formData.get('bathrooms')).toBe('2');
      expect(formData.get('squaremeters')).toBe('120');
      expect(formData.get('description')).toBe('Hermosa casa en la ciudad.');
      expect(formData.get('images')).toBeInstanceOf(File);
    });

    // Verificar que el mensaje de éxito se muestre
    expect(screen.getByText('¡Propiedad agregada con éxito!')).toBeInTheDocument();
  });
});

describe('AddProperty Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('envía los datos del formulario correctamente al hacer clic en el botón de enviar', async () => {
    // Mock de la respuesta de addPropertyRequest
    mockAddPropertyRequest.mockResolvedValue({ status: 201 });

    render(
      <Router>
        <AddProperty />
      </Router>
    );

    // Rellenar el formulario
    fireEvent.change(screen.getByPlaceholderText(/Titulo/i), { target: { value: 'Casa Bonita' } });
    fireEvent.change(screen.getByPlaceholderText(/Precio/i), { target: { value: '500000' } });
    fireEvent.change(screen.getByPlaceholderText(/Ubicación/i), { target: { value: 'Ciudad' } });
    fireEvent.change(screen.getByPlaceholderText(/Recamaras/i), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText(/Baños/i), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText(/m²/i), { target: { value: '120' } });
    fireEvent.change(screen.getByPlaceholderText(/Detalles/i), { target: { value: 'Hermosa casa en la ciudad.' } });

    // Simular la subida de una imagen
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Imagen:/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    // Simular el clic en el botón de enviar
    fireEvent.click(screen.getByText(/Publicar/i));

    // Esperar a que se complete la llamada a la función mockeada
    await vi.waitFor(() => mockAddPropertyRequest.mock.calls.length === 1);

    // Verificar que addPropertyRequest haya sido llamada correctamente
    expect(mockAddPropertyRequest).toHaveBeenCalledTimes(1);
    const formData = mockAddPropertyRequest.mock.calls[0][0] as FormData;
    expect(formData.get('title')).toBe('Casa Bonita');
    expect(formData.get('price')).toBe('500000');
    expect(formData.get('location')).toBe('Ciudad');
    expect(formData.get('bedrooms')).toBe('3');
    expect(formData.get('bathrooms')).toBe('2');
    expect(formData.get('squaremeters')).toBe('120');
    expect(formData.get('description')).toBe('Hermosa casa en la ciudad.');
    expect(formData.get('images')).toBeInstanceOf(File);
  });
});