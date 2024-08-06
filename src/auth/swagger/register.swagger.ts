import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';

export const RegisterSwagger = {
  operation: ApiOperation({ summary: 'User registration' }),
  body: ApiBody({
    description: 'Registration request payload',
    type: RegisterDto,
  }),
  responses: {
    success: ApiResponse({
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
    badRequest: ApiResponse({
      status: 400,
      description: 'Bad request, invalid input data.',
    }),
  },
};
