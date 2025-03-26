import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Dashboard from '../../components/dashboard/Dashboard';
import { AuthProvider } from '../../contexts/AuthContext';
import { useBookings, useProperties } from '../../api/hooks';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

// Mock API hooks
jest.mock('@/api/hooks', () => ({
  useBookings: jest.fn(),
  useProperties: jest.fn(),
}));

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock Auth Context
const mockAuth = {
  currentUser: {
    email: 'test@example.com',
    displayName: 'Test User',
  },
  signOut: jest.fn(),
};

describe('Dashboard', () => {
  const mockBookings = [
    {
      id: '1',
      propertyName: 'Test Property 1',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      status: 'confirmed',
    },
    {
      id: '2',
      propertyName: 'Test Property 2',
      checkIn: '2024-04-01',
      checkOut: '2024-04-05',
      status: 'pending',
    },
  ];

  const mockProperties = [
    {
      id: '1',
      name: 'Test Property 1',
      type: 'hotel',
      price: 100,
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Test Property 2',
      type: 'apartment',
      price: 80,
      rating: 4.2,
    },
  ];

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
    (useBookings as jest.Mock).mockReturnValue({
      data: mockBookings,
      isLoading: false,
      error: null,
    });
    (useProperties as jest.Mock).mockReturnValue({
      data: mockProperties,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard correctly', () => {
    render(<Dashboard />);

    expect(screen.getByText(/dashboard-title/i)).toBeInTheDocument();
    expect(screen.getByText(/upcoming-bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/featured-properties/i)).toBeInTheDocument();
  });

  it('displays loading state', () => {
    (useBookings as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    (useProperties as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<Dashboard />);

    expect(screen.getAllByText(/loading/i)).toHaveLength(2);
  });

  it('displays error state', () => {
    const errorMessage = 'Failed to load data';
    (useBookings as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error(errorMessage),
    });
    (useProperties as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error(errorMessage),
    });

    render(<Dashboard />);

    expect(screen.getAllByText(/error-loading/i)).toHaveLength(2);
  });

  it('displays bookings correctly', () => {
    render(<Dashboard />);

    mockBookings.forEach((booking) => {
      expect(screen.getByText(booking.propertyName)).toBeInTheDocument();
      expect(screen.getByText(booking.checkIn)).toBeInTheDocument();
      expect(screen.getByText(booking.checkOut)).toBeInTheDocument();
      expect(screen.getByText(booking.status)).toBeInTheDocument();
    });
  });

  it('displays properties correctly', () => {
    render(<Dashboard />);

    mockProperties.forEach((property) => {
      expect(screen.getByText(property.name)).toBeInTheDocument();
      expect(screen.getByText(property.type)).toBeInTheDocument();
      expect(screen.getByText(property.price.toString())).toBeInTheDocument();
      expect(screen.getByText(property.rating.toString())).toBeInTheDocument();
    });
  });

  it('handles booking filter changes', async () => {
    render(<Dashboard />);

    const filterSelect = screen.getByLabelText(/filter-bookings/i);
    fireEvent.change(filterSelect, { target: { value: 'confirmed' } });

    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Property 2')).not.toBeInTheDocument();
    });
  });

  it('handles property search', async () => {
    render(<Dashboard />);

    const searchInput = screen.getByPlaceholderText(/search-properties/i);
    fireEvent.change(searchInput, { target: { value: 'hotel' } });

    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Property 2')).not.toBeInTheDocument();
    });
  });

  it('handles property sort changes', async () => {
    render(<Dashboard />);

    const sortSelect = screen.getByLabelText(/sort-properties/i);
    fireEvent.change(sortSelect, { target: { value: 'price_asc' } });

    await waitFor(() => {
      const properties = screen.getAllByText(/Test Property/i);
      expect(properties[0]).toHaveTextContent('Test Property 2');
      expect(properties[1]).toHaveTextContent('Test Property 1');
    });
  });

  it('handles booking action clicks', async () => {
    const mockOnBookingAction = jest.fn();
    render(<Dashboard onBookingAction={mockOnBookingAction} />);

    const actionButton = screen.getByRole('button', { name: /view-details/i });
    fireEvent.click(actionButton);

    await waitFor(() => {
      expect(mockOnBookingAction).toHaveBeenCalledWith('1', 'view');
    });
  });

  it('handles property action clicks', async () => {
    const mockOnPropertyAction = jest.fn();
    render(<Dashboard onPropertyAction={mockOnPropertyAction} />);

    const actionButton = screen.getByRole('button', { name: /book-now/i });
    fireEvent.click(actionButton);

    await waitFor(() => {
      expect(mockOnPropertyAction).toHaveBeenCalledWith('1', 'book');
    });
  });

  it('sollte den Benutzernamen anzeigen', () => {
    render(
      <MemoryRouter>
        <AuthProvider auth={mockAuth as any}>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });

  it('sollte die E-Mail-Adresse des Benutzers anzeigen', () => {
    render(
      <MemoryRouter>
        <AuthProvider auth={mockAuth as any}>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('sollte den Logout-Button anzeigen', () => {
    render(
      <MemoryRouter>
        <AuthProvider auth={mockAuth as any}>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('sollte die Logout-Funktion aufrufen, wenn der Button geklickt wird', async () => {
    render(
      <MemoryRouter>
        <AuthProvider auth={mockAuth as any}>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    expect(mockAuth.signOut).toHaveBeenCalled();
  });

  it('sollte die Navigation zu den Buchungen anzeigen', () => {
    render(
      <MemoryRouter>
        <AuthProvider auth={mockAuth as any}>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /bookings/i })).toBeInTheDocument();
  });

  it('sollte die Navigation zu den Immobilien anzeigen', () => {
    render(
      <MemoryRouter>
        <AuthProvider auth={mockAuth as any}>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /properties/i })).toBeInTheDocument();
  });

  it('sollte den Willkommenstext anzeigen', () => {
    render(
      <MemoryRouter>
        <AuthProvider auth={mockAuth as any}>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  describe('Dashboard Layout', () => {
    it('sollte das korrekte Layout-Grid haben', () => {
      render(
        <MemoryRouter>
          <AuthProvider auth={mockAuth as any}>
            <Dashboard />
          </AuthProvider>
        </MemoryRouter>
      );
      const mainGrid = screen.getByTestId('dashboard-grid');
      expect(mainGrid).toHaveClass('grid');
    });

    it('sollte die Statistik-Karten anzeigen', () => {
      render(
        <MemoryRouter>
          <AuthProvider auth={mockAuth as any}>
            <Dashboard />
          </AuthProvider>
        </MemoryRouter>
      );
      const statsCards = screen.getAllByTestId(/stats-card/);
      expect(statsCards.length).toBeGreaterThan(0);
    });
  });

  describe('Dashboard Interaktionen', () => {
    it('sollte die Profilbearbeitung öffnen, wenn der Edit-Button geklickt wird', () => {
      render(
        <MemoryRouter>
          <AuthProvider auth={mockAuth as any}>
            <Dashboard />
          </AuthProvider>
        </MemoryRouter>
      );
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);
      expect(screen.getByTestId('profile-edit-modal')).toBeInTheDocument();
    });

    it('sollte die Benachrichtigungen anzeigen, wenn die Glocke geklickt wird', () => {
      render(
        <MemoryRouter>
          <AuthProvider auth={mockAuth as any}>
            <Dashboard />
          </AuthProvider>
        </MemoryRouter>
      );
      const notificationBell = screen.getByRole('button', { name: /notifications/i });
      fireEvent.click(notificationBell);
      expect(screen.getByTestId('notifications-dropdown')).toBeInTheDocument();
    });
  });

  describe('Dashboard Responsiveness', () => {
    it('sollte das mobile Menü anzeigen, wenn der Hamburger-Button geklickt wird', () => {
      render(
        <MemoryRouter>
          <AuthProvider auth={mockAuth as any}>
            <Dashboard />
          </AuthProvider>
        </MemoryRouter>
      );
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });
  });
}); 