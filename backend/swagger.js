import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'GameStore API',
    description: 'Documentazione delle API REST per lo store di videogiochi MERN',
  },
  host: 'localhost:5000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['./server.js']; // Punta al tuo entry point che monta le route

swaggerAutogen()(outputFile, routes, doc);