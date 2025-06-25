import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { Message } from 'ai';
import { AiService } from './ai.service';

@Controller()
export class AppController {
  constructor(private readonly aiService: AiService) {}

  @Get()
  getHello() {
    return 'go to stream';
  }

  @Get('stream')
  async stream(@Query('message') message: string, @Res() res: Response) {
    console.log('message', message);

    if (!message) {
      res.status(400).send('Missing ?message= query');
      return;
    }

    const messages = [{ role: 'user', content: message }] as Message[];

    try {
      const result: any = await this.aiService.stream(messages);

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      const txt = result.textStream;

      for await (const chunk of txt) {
        console.log('result', chunk);
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
      res.end();
    } catch (error) {
      console.error('Error streaming:', error);
      res.status(500).send('Error processing stream');
    }
  }

  @Get('chat')
  async chat(
    @Query('message') message: string,
  ): Promise<{ message: string; usage?: any }> {
    if (!message) {
      throw new Error('Missing ?message= query');
    }

    const messages = [{ role: 'user', content: message }] as Message[];

    try {
      const result = await this.aiService.generate(messages);

      return {
        message: result.text,
        usage: result.usage,
      };
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Error processing message');
    }
  }
}
