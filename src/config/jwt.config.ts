import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const jwtConfig = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '1h',
  },
};
