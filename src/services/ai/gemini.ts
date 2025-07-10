import { GoogleGenAI } from '@google/genai';
import ENV from 'src/constants/env';

export const genai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
