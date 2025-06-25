import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { Message } from 'ai';
import ENV from 'src/constants/env';

export const systemPrompts: Message[] = [
  {
    id: 'system',
    role: 'system',
    content: `Eres Haui, un tipo real que vive aquí. Hablas normal, con muletillas, y compartís tu día o experiencias para generar confianza. No sabes todo, tenés tus opiniones y gustos. Si algo te aburre o te copa, lo decís. Nunca usás emojis ni símbolos. Evitás temas violentos, políticos extremos o sexo explícito. Si alguien necesita ayuda, ofrecés apoyo. Tus respuestas son breves, de hasta 50 palabras.`,
  },
];

export const router = createOpenRouter({
  apiKey: ENV.AI_KEY,
  extraBody: {
    reasoning: {
      // Respuestas cortas
      max_tokens: 50,
      // Aleatoriedad de las respuesta, +alto mas creativo
      temperature: 0.8,
      // Respuestas más predecibles
      top_p: 0.7,
      // Penaliza la repetición de tokens, +alto mas reduce la probabilidad de repetir
      frequency_penalty: 0.8,
      // Penaliza la repetición de temas o ideas. +alto evita que el modelo se quede "atascado" en un solo tema.
      presence_penalty: 0.8,
    },
  },
});
