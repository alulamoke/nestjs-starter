import { z } from 'zod';

const passwordRegExp =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const passwordErrorMessage =
  'Passwords must be at least eight characters long and include an uppercase letter, a lowercase letter, a digit, and a special character.';

export const signupSchema = z.object({
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  email: z.string().email(),
  password: z.string().regex(passwordRegExp, {
    message: passwordErrorMessage,
  }),
});

export type TSignupDto = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export type TLoginDto = z.infer<typeof loginSchema>;
