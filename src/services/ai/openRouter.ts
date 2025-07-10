import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import ENV from '../../constants/env';

export const router = createOpenRouter({
  apiKey: ENV.AI_KEY,
});
