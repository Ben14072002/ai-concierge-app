import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import ChatBot from '../ChatBot';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock AI Service
jest.mock('../../../services/aiService', () => ({
  getAIResponse: jest.fn().mockResolvedValue({
    response: 'Test AI response',
    recommendations: [],
  }),
}));

describe('ChatBot Component', () => {
  const renderChatBot = () => {
    return render(
      <SnackbarProvider>
        <ChatBot />
      </SnackbarProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders chat interface', () => {
    renderChatBot();
    
    expect(screen.getByPlaceholderText('chat.inputPlaceholder')).toBeInTheDocument();
    expect(screen.getByText('chat.sendButton')).toBeInTheDocument();
  });

  test('sends message and displays response', async () => {
    renderChatBot();
    
    const input = screen.getByPlaceholderText('chat.inputPlaceholder');
    const sendButton = screen.getByText('chat.sendButton');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Test AI response')).toBeInTheDocument();
    });
  });

  test('displays loading state while waiting for response', async () => {
    renderChatBot();
    
    const input = screen.getByPlaceholderText('chat.inputPlaceholder');
    const sendButton = screen.getByText('chat.sendButton');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('chat.loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('chat.loading')).not.toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    const mockError = new Error('Test error');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { getAIResponse } = require('../../../services/aiService');
    getAIResponse.mockRejectedValueOnce(mockError);

    renderChatBot();
    
    const input = screen.getByPlaceholderText('chat.inputPlaceholder');
    const sendButton = screen.getByText('chat.sendButton');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('chat.error')).toBeInTheDocument();
    });
  });
}); 