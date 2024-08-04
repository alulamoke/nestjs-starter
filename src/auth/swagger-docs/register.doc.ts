import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const registerSwaggerDocs = {
  operation: ApiOperation({ summary: 'User registration' }),
  body: ApiBody({
    description: 'Registration request payload',
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string', example: 'John' },
        last_name: { type: 'string', example: 'Doe' },
        email: {
          type: 'string',
          format: 'email',
          example: 'john.doe@example.com',
        },
        password: { type: 'string', example: 'password123' },
      },
      required: ['first_name', 'last_name', 'email', 'password'],
    },
  }),
  responses_1: ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'User registered successfully. Please check your email to verify your account.',
        },
      },
      required: ['message'],
    },
  }),
  responses_2: ApiResponse({
    status: 400,
    description: 'Bad request, invalid input data.',
  }),
};
