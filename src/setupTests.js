// Define globals before any imports
const { TextEncoder, TextDecoder } = require('util');
const { Blob, File } = require('buffer');
const { fetch, Request, Response, Headers } = require('undici');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Blob = Blob;
global.File = File;
global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;
global.ArrayBuffer = ArrayBuffer;
global.Uint8Array = Uint8Array;

// Now import other dependencies
import '@testing-library/jest-dom';

// Mock IntersectionObserver
class IntersectionObserver {
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

// Mock ResizeObserver
class ResizeObserver {
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});

// Setup MSW
const { server } = require('./mocks/server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close()); 