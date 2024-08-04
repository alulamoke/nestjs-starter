import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const loginSwaggerDocs = {
  operation: ApiOperation({ summary: 'User login' }),
  body: ApiBody({
    description: 'Login request payload',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  }),
  responses_1: ApiResponse({
    status: 200,
    description: 'Login successful.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'your-access-token' },
      },
      required: ['access_token'],
    },
  }),
  responses_2: ApiResponse({
    status: 401,
    description: 'invalid credentials',
  }),
};
