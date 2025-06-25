import { Injectable } from '@nestjs/common';
import { generateText, Message } from 'ai';
import { router, systemPrompts } from './extra';
import ENV from 'src/constants/env';

@Injectable()
export class AiService {
  public conversationHistory: Message[] = [...systemPrompts];
  private readonly openRouter = router;
  private readonly model = this.openRouter(ENV.AI_MODEL);
  private readonly maxHistorySize = 10;

  public async chat(message: string): Promise<string> {
    const newMessage: Message = {
      role: 'user',
      content: message,
      id: String(this.conversationHistory.length + 1),
    };

    this.conversationHistory.push(newMessage);
    this.trimHistory();

    try {
      const { text } = await generateText({
        model: this.model,
        messages: this.conversationHistory,
      });

      const botMessage: Message = {
        role: 'assistant',
        content: text,
        id: String(this.conversationHistory.length + 1),
      };

      this.conversationHistory.push(botMessage);
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

  public async test(message: string): Promise<string> {
    const newMessage: Message = {
      role: 'user',
      content: message,
      id: String(this.conversationHistory.length + 1),
    };

    this.conversationHistory.push(newMessage);
    this.trimHistory();

    const simulatedResponse = `Respuesta simulada: El absurdo es esa sensación de que todo tiene sentido hasta que te das cuenta de que no lo tiene. Es como cuando ves que la gente hace cosas que no entiendes, pero no por falta de lógica, sino porque cada quien tiene su propia forma de ver el mundo.`;

    const botMessage: Message = {
      role: 'assistant',
      content: simulatedResponse,
      id: String(this.conversationHistory.length + 1),
    };

    this.conversationHistory.push(botMessage);
    this.trimHistory();

    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(simulatedResponse);
      }, 100);
    });
  }
}
