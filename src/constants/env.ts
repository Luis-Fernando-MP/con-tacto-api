import { config } from 'dotenv';

config();

const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  AI_KEY: process.env.AI_KEY as string,
  AI_MODEL: process.env.AI_MODEL as string,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
  GEMINI_MODEL: process.env.GEMINI_MODEL as string,
};

export default ENV;
