import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { useTranslation } from 'react-i18next';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('FeedbackForm', () => {
  const mockOnSubmit = jest.fn();
  const mockBooking = {
    id: '1',
    propertyName: 'Test Property',
    checkIn: '2024-03-20',
    checkOut: '2024-03-25',
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders feedback form correctly', () => {
    render(<FeedbackForm booking={mockBooking} onSubmit={mockOnSubmit} />);

    expect(screen.getByText(/feedback-title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<FeedbackForm booking={mockBooking} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/rating-required/i)).toBeInTheDocument();
      expect(screen.getByText(/comment-required/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    render(<FeedbackForm booking={mockBooking} onSubmit={mockOnSubmit} />);

    const ratingInput = screen.getByLabelText(/rating/i);
    const commentInput = screen.getByLabelText(/comment/i);

    fireEvent.change(ratingInput, { target: { value: '5' } });
    fireEvent.change(commentInput, { target: { value: 'Great experience!' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        bookingId: mockBooking.id,
        propertyName: mockBooking.propertyName,
        rating: 5,
        comment: 'Great experience!',
        checkIn: mockBooking.checkIn,
        checkOut: mockBooking.checkOut,
      });
    });
  });

  it('validates rating is within range', async () => {
    render(<FeedbackForm booking={mockBooking} onSubmit={mockOnSubmit} />);

    const ratingInput = screen.getByLabelText(/rating/i);
    const commentInput = screen.getByLabelText(/comment/i);

    fireEvent.change(ratingInput, { target: { value: '6' } });
    fireEvent.change(commentInput, { target: { value: 'Test comment' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/rating-range/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('validates comment length', async () => {
    render(<FeedbackForm booking={mockBooking} onSubmit={mockOnSubmit} />);

    const ratingInput = screen.getByLabelText(/rating/i);
    const commentInput = screen.getByLabelText(/comment/i);

    fireEvent.change(ratingInput, { target: { value: '5' } });
    fireEvent.change(commentInput, { target: { value: 'a'.repeat(501) } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/comment-length/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('disables submit button while submitting', async () => {
    render(<FeedbackForm booking={mockBooking} onSubmit={mockOnSubmit} />);

    const ratingInput = screen.getByLabelText(/rating/i);
    const commentInput = screen.getByLabelText(/comment/i);

    fireEvent.change(ratingInput, { target: { value: '5' } });
    fireEvent.change(commentInput, { target: { value: 'Test comment' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument();
    });
  });

  it('displays error message when submission fails', async () => {
    const errorMessage = 'Failed to submit feedback';
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage));

    render(<FeedbackForm booking={mockBooking} onSubmit={mockOnSubmit} />);

    const ratingInput = screen.getByLabelText(/rating/i);
    const commentInput = screen.getByLabelText(/comment/i);

    fireEvent.change(ratingInput, { target: { value: '5' } });
    fireEvent.change(commentInput, { target: { value: 'Test comment' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error-submitting/i)).toBeInTheDocument();
    });
  });
}); 