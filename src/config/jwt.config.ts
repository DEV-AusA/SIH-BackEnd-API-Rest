import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.development.env' });

export const jwtConfig = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '1h',
  },
};
