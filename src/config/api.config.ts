import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  version: process.env.VERSION,
}));
