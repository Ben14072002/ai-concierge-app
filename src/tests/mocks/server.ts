import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API Endpunkte
const handlers = [
  // Auth Endpunkte
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        },
        token: 'mock-jwt-token'
      })
    );
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        message: 'User registered successfully'
      })
    );
  }),

  // Booking Endpunkte
  rest.get('/api/bookings', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          propertyId: 'prop1',
          checkIn: '2024-03-20',
          checkOut: '2024-03-25',
          guests: 2,
          status: 'confirmed'
        }
      ])
    );
  }),

  rest.post('/api/bookings', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '2',
        message: 'Booking created successfully'
      })
    );
  }),

  // Feedback Endpunkte
  rest.get('/api/feedback', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          bookingId: '1',
          rating: 5,
          comment: 'Great experience!'
        }
      ])
    );
  }),

  rest.post('/api/feedback', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '2',
        message: 'Feedback submitted successfully'
      })
    );
  }),

  // Error Handler
  rest.all('*', (req, res, ctx) => {
    return res(
      ctx.status(404),
      ctx.json({
        message: 'Not Found'
      })
    );
  })
];

export const server = setupServer(...handlers); 