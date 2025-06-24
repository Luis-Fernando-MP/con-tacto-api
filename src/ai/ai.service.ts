import { Injectable } from '@nestjs/common';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { Message, streamText, generateText, GenerateTextResult } from 'ai';
import { systemPrompts } from './extra';
import ENV from 'src/constants/env';

@Injectable()
export class AiService {
  private readonly openRouter = createOpenRouter({
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

  private conversationHistory: Message[] = [];
  private readonly model = this.openRouter(ENV.AI_MODEL);

  stream(messages: Message[]): any {
    this.conversationHistory = [...this.conversationHistory, ...messages];
    return streamText({
      model: this.model,
      messages: [...systemPrompts, ...this.conversationHistory],
    });
  }

  async generate(messages: Message[]): Promise<GenerateTextResult<any, any>> {
    this.conversationHistory = [...this.conversationHistory, ...messages];
    // return generateText({
    //   model: this.model,
    //   messages: [...systemPrompts, ...this.conversationHistory],
    // });
    return await new Promise((resolve) => {
      resolve({ messages: [...systemPrompts, ...this.conversationHistory] });
    });
  }
}
