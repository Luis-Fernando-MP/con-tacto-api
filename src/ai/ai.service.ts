import { Injectable } from '@nestjs/common';
import { generateText, Message } from 'ai';
import { router, systemPrompts, storyModePrompts } from './extra';
import ENV from '../constants/env';

@Injectable()
export class AiService {
  public conversationHistory: Omit<Message, 'id'>[] = [...systemPrompts];
  private readonly openRouter = router;
  private readonly model = this.openRouter(ENV.AI_MODEL);
  private readonly maxHistorySize = 9;

  public async chat(message: string): Promise<string> {
    return this.generateResponse(message, this.conversationHistory);
  }

  public async story(topic: string): Promise<string> {
    const storyPrompt = `Cuéntame una historia sobre ${topic}.`;
    const lastTwoConversations = this.getLastTwoConversations();
    return this.generateResponse(storyPrompt, [
      ...lastTwoConversations,
      ...storyModePrompts,
    ]);
  }

  private getLastTwoConversations() {
    return this.conversationHistory.slice(-2);
  }

  private async generateResponse(
    message: string,
    conversationHistory: Omit<Message, 'id'>[],
  ): Promise<string> {
    const newMessage: Omit<Message, 'id'> = { role: 'user', content: message };

    const messages = [...conversationHistory, newMessage];

    try {
      const { text } = await generateText({
        model: this.model,
        messages,
      });

      const botMessage: Omit<Message, 'id'> = {
        role: 'assistant',
        content: text,
      };

      messages.push(botMessage);
      this.conversationHistory = messages;
      this.trimHistory();

      return text;
    } catch (error) {
      console.error('Error al generar la respuesta:', error);
      throw new Error(
        'Hubo un problema al generar la respuesta. Por favor, inténtalo de nuevo más tarde.',
      );
    }
  }

  private trimHistory() {
    if (this.conversationHistory.length <= this.maxHistorySize) return;
    this.conversationHistory = this.conversationHistory.slice(
      -this.maxHistorySize,
    );
  }

  public async test(): Promise<string> {
    const simulatedResponse = `Respuesta simulada: El absurdo es esa sensación de que todo tiene sentido hasta que te das cuenta de que no lo tiene. Es como cuando ves que la gente hace cosas que no entiendes, pero no por falta de lógica, sino porque cada quien tiene su propia forma de ver el mundo.`;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(simulatedResponse);
      }, 100);
    });
  }
}
