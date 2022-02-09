import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
  cloudWatch: {
    logGroup: process.env.CLOUD_WATCH_LOG_GROUP,
    logStream: process.env.CLOUD_WATCH_LOG_STREAM,
    show: process.env.CLOUD_WATCH_LOG_SHOW || 'enable',
  },
}));
