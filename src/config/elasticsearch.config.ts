import { registerAs } from '@nestjs/config';

export default registerAs('elasticsearch', () => ({
  url: process.env.ELASTICSEARCH_URL,
  prefix: process.env.ELASTICSEARCH_PREFIX || '',
}));
