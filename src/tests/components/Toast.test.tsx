import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastContainer } from '@/components/common/ToastContainer';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    promise: jest.fn(),
  },
  ToastContainer: jest.fn(),
}));

describe('ToastContainer', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders toast container with default props', () => {
    render(<ToastContainer />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass(
      'toast-container',
      'toast-top-right',
      'toast-theme--colored'
    );
  });

  it('renders toast container with custom position', () => {
    render(<ToastContainer position="top-center" />);

    expect(screen.getByRole('alert')).toHaveClass('toast-top-center');
  });

  it('renders toast container with custom theme', () => {
    render(<ToastContainer theme="light" />);

    expect(screen.getByRole('alert')).toHaveClass('toast-theme--light');
  });

  it('renders toast container with custom autoClose duration', () => {
    render(<ToastContainer autoClose={5000} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-auto-close', '5000');
  });

  it('renders toast container with custom limit', () => {
    render(<ToastContainer limit={3} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-limit', '3');
  });

  it('renders toast container with custom closeOnClick', () => {
    render(<ToastContainer closeOnClick={false} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-close-on-click', 'false');
  });

  it('renders toast container with custom pauseOnHover', () => {
    render(<ToastContainer pauseOnHover={false} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-pause-on-hover', 'false');
  });

  it('renders toast container with custom draggable', () => {
    render(<ToastContainer draggable={false} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-draggable', 'false');
  });

  it('renders toast container with custom closeButton', () => {
    render(<ToastContainer closeButton={false} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-close-button', 'false');
  });

  it('renders toast container with custom newestOnTop', () => {
    render(<ToastContainer newestOnTop={false} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-newest-on-top', 'false');
  });

  it('renders toast container with custom rtl', () => {
    render(<ToastContainer rtl={true} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-rtl', 'true');
  });

  it('renders toast container with custom enableMultiContainer', () => {
    render(<ToastContainer enableMultiContainer={true} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-enable-multi-container', 'true');
  });

  it('renders toast container with custom containerId', () => {
    render(<ToastContainer containerId="custom-container" />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-container-id', 'custom-container');
  });

  it('renders toast container with custom className', () => {
    const customClass = 'custom-toast-class';
    render(<ToastContainer className={customClass} />);

    expect(screen.getByRole('alert')).toHaveClass(customClass);
  });

  it('renders toast container with custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    render(<ToastContainer style={customStyle} />);

    expect(screen.getByRole('alert')).toHaveStyle(customStyle);
  });

  it('renders toast container with custom toastClassName', () => {
    const customClass = 'custom-toast-class';
    render(<ToastContainer toastClassName={customClass} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-toast-class', customClass);
  });

  it('renders toast container with custom bodyClassName', () => {
    const customClass = 'custom-body-class';
    render(<ToastContainer bodyClassName={customClass} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-body-class', customClass);
  });

  it('renders toast container with custom progressClassName', () => {
    const customClass = 'custom-progress-class';
    render(<ToastContainer progressClassName={customClass} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-progress-class', customClass);
  });

  it('renders toast container with custom progressStyle', () => {
    const customStyle = { backgroundColor: 'blue' };
    render(<ToastContainer progressStyle={customStyle} />);

    expect(screen.getByRole('alert')).toHaveAttribute('data-progress-style', JSON.stringify(customStyle));
  });
}); 