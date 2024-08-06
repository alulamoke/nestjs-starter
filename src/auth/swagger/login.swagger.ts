import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

export const LoginSwagger = {
  operation: ApiOperation({ summary: 'User login' }),
  body: ApiBody({
    description: 'Login request payload',
    type: LoginDto,
  }),
  responses: {
    success: ApiResponse({
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
    unauthorized: ApiResponse({
      status: 401,
      description: 'Invalid credentials',
    }),
  },
};
