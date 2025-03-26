import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatBot } from '@/components/chat/ChatBot';
import { useTranslation } from 'react-i18next';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('ChatBot', () => {
  const mockOnClose = jest.fn();
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat interface correctly', () => {
    render(<ChatBot onClose={mockOnClose} onSendMessage={mockOnSendMessage} />);

    expect(screen.getByText(/chatbot-title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/type-message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('handles message input and submission', async () => {
    render(<ChatBot onClose={mockOnClose} onSendMessage={mockOnSendMessage} />);

    const messageInput = screen.getByPlaceholderText(/type-message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
      expect(messageInput.value).toBe('');
    });
  });

  it('handles empty message submission', async () => {
    render(<ChatBot onClose={mockOnClose} onSendMessage={mockOnSendMessage} />);

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockOnSendMessage).not.toHaveBeenCalled();
      expect(screen.getByText(/message-required/i)).toBeInTheDocument();
    });
  });

  it('handles message submission with Enter key', async () => {
    render(<ChatBot onClose={mockOnClose} onSendMessage={mockOnSendMessage} />);

    const messageInput = screen.getByPlaceholderText(/type-message/i);

    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.keyPress(messageInput, { key: 'Enter', code: 13, charCode: 13 });

    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
      expect(messageInput.value).toBe('');
    });
  });

  it('handles close button click', () => {
    render(<ChatBot onClose={mockOnClose} onSendMessage={mockOnSendMessage} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays loading state while sending message', async () => {
    render(<ChatBot onClose={mockOnClose} onSendMessage={mockOnSendMessage} />);

    const messageInput = screen.getByPlaceholderText(/type-message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(sendButton).toBeDisabled();
    expect(screen.getByText(/sending/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(sendButton).not.toBeDisabled();
      expect(screen.queryByText(/sending/i)).not.toBeInTheDocument();
    });
  });

  it('displays error message when message sending fails', async () => {
    const errorMessage = 'Failed to send message';
    mockOnSendMessage.mockRejectedValueOnce(new Error(errorMessage));

    render(<ChatBot onClose={mockOnClose} onSendMessage={mockOnSendMessage} />);

    const messageInput = screen.getByPlaceholderText(/type-message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/error-sending-message/i)).toBeInTheDocument();
    });
  });
}); 