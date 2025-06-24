import { config } from 'dotenv';

config();

const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  AI_KEY: process.env.AI_KEY as string,
  AI_MODEL: process.env.AI_MODEL as string,
};

export default ENV;
