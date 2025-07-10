import { Injectable } from '@nestjs/common';
import { generateText, Message } from 'ai';
import { router } from './openRouter';
import ENV from '../../constants/env';
import { storyModePrompts, baseChatPrompt } from './prompts';
import { genai } from './gemini';

@Injectable()
export class AiService {
  public conversationHistory: Omit<Message, 'id'>[] = [];
  private readonly openRouter = router;
  private readonly model = this.openRouter(ENV.AI_MODEL);
  private readonly maxHistorySize = 8;

  constructor() {
    this.conversationHistory = [...baseChatPrompt];
  }

  public async chat(message: string, useGemini = false): Promise<string> {
    return this.generateResponse(message, useGemini);
  }

  public async story(topic: string): Promise<string> {
    const storyPrompt = `Cuéntame una historia sobre ${topic}.`;
    const lastTwo = this.conversationHistory.slice(-2);
    return this.generateResponse(storyPrompt, false, [
      ...lastTwo,
      ...storyModePrompts,
    ]);
  }

  private async generateResponse(
    message: string,
    useGemini: boolean = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    baseHistory: Omit<Message, 'id'>[] = [],
  ): Promise<string> {
    const userMessage: Omit<Message, 'id'> = { role: 'user', content: message };

    this.conversationHistory.push(userMessage);

    let response = '';
    if (useGemini) response = await this.useGemini(this.conversationHistory);
    else response = await this.useOpenRouter(this.conversationHistory);

    this.conversationHistory.push({
      role: 'system',
      content: response,
    });

    this.trimHistory();
    return response;
  }

  private trimHistory() {
    if (this.conversationHistory.length <= this.maxHistorySize) return;

    this.conversationHistory = [
      baseChatPrompt[0],
      ...this.conversationHistory.slice(-(this.maxHistorySize - 1)), // Mantener los últimos mensajes que no excedan maxHistorySize
    ];
  }

  private async useOpenRouter(
    messages: Omit<Message, 'id'>[],
  ): Promise<string> {
    console.log('openRouter speak');
    try {
      const { text } = await generateText({
        model: this.model,
        messages,
        providerOptions: {
          openrouter: {
            reasoning: {
              max_tokens: 100,
            },
          },
        },
      });
      return text;
    } catch (error) {
      console.error('Error al generar respuesta con OpenRouter:', error);
      throw new Error('Hubo un problema con OpenRouter');
    }
  }

  private async useGemini(history: Omit<Message, 'id'>[]): Promise<string> {
    console.log('gemini speak');
    const contents = history.map((m) => ({
      role: m.role === 'system' ? 'model' : m.role,
      parts: [{ text: m.content }],
    }));
    try {
      const response = await genai.models.generateContent({
        model: ENV.GEMINI_MODEL,
        contents,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          temperature: 0.5,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 120,
        },
      });
      return response.text ?? '';
    } catch (error) {
      console.error('Error Gemini:', error);
      throw new Error('Hubo un problema con Gemini');
    }
  }

  public async test(): Promise<string> {
    return new Promise((res) =>
      setTimeout(
        () =>
          res(
            'Respuesta simulada: todo lo que hacemos tiene sentido… hasta que dejamos de pensarlo.',
          ),
        100,
      ),
    );
  }
}
