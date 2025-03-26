const { setupServer } = require('msw/node');
const { rest } = require('msw');

const handlers = [
  // Add your mock handlers here
];

const server = setupServer(...handlers);

module.exports = { server }; 