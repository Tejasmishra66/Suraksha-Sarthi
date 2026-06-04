const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SDRF Helping Hands API',
      version: '1.0.0',
      description: 'API documentation for the SDRF disaster-response coordination system.',
    },
    servers: [
      {
        url: 'http://localhost:4001',
        description: 'Local Backend Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    // Pre-populated paths for immediate testing
    paths: {
      '/auth/login': {
        post: {
          summary: 'Log in a user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'officer@sdrf.local' },
                    password: { type: 'string', example: 'password123' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Successful login returning JWT' },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    phone: { type: 'string' },
                    department: { type: 'string' },
                    address: { type: 'string' },
                    place: { type: 'string' },
                    district: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'User created successfully' }
          }
        }
      },
      '/incidents': {
        get: {
          summary: 'Get all incidents',
          tags: ['Incidents'],
          responses: {
            200: { description: 'List of incidents' }
          }
        }
      }
    }
  },
  // Tells Swagger to also read JSDoc comments inside your actual route/controller files
  apis: ['./src/routes/*.js', './src/controllers/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('Swagger API Docs available at http://localhost:4001/api-docs');
};