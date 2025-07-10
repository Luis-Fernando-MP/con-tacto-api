import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { AiService } from 'src/services/ai/ai.service';
import TTSService from 'src/services/tts/tts.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly aiService: AiService,
    private readonly tts: TTSService,
  ) {}

  async create(dto: CreateChatDto) {
    try {
      const { audio } = await this.generateAudio(dto);

      const inputBuffer = Buffer.from(audio, 'base64');
      const wavBuffer = await this.tts.convertToWav(inputBuffer);

      return wavBuffer;
    } catch (e) {
      console.log('error:', e?.message);
      throw new InternalServerErrorException(
        'Error al procesar el archivo wav',
      );
    }
  }

  async to_hex(dto: CreateChatDto) {
    try {
      const { audio } = await this.generateAudio(dto);

      const inputBuffer = Buffer.from(audio, 'base64');

      // 1. Convierte cada byte a 0xHH (asegura tipo: string[])
      const hexArray: string[] = Array.from(inputBuffer).map(
        (byte: number) => `0x${byte.toString(16).padStart(2, '0')}`,
      );
      // 2. Divide en líneas tipo C (chunked output)
      const lines: string[] = [];

      const chunkSize = 16;
      for (let i = 0; i < hexArray.length; i += chunkSize) {
        const chunkLine = hexArray.slice(i, i + chunkSize).join(', ');
        lines.push(chunkLine);
      }
      // 3. Formato final para código C
      const result = `uint8_t audio[] = {\n  ${lines.join(',\n  ')}\n};`;

      return result;
    } catch (e) {
      console.log('error:', e?.message);
      throw new InternalServerErrorException(
        'Error al procesar el archivo de audio',
      );
    }
  }

  async generateAudio({
    prompt,
    test,
    model,
    useGemini = false,
    ...ttsOptions
  }: CreateChatDto) {
    try {
      console.log(`prompt: ${prompt}`);
      let response = await this.aiService.test();
      if (!test) response = await this.aiService.chat(prompt, useGemini);

      console.time('ai-generation');
      console.log(`response: ${response}`);
      const base64Audio = await this.tts.speak({
        text: response,
        model: model,
        ...ttsOptions,
      });
      console.timeEnd('ai-generation');

      return {
        text: response,
        audio: base64Audio,
      };
    } catch (e) {
      console.log('error:', e?.message);
      throw new InternalServerErrorException('No se pudo generar el audio');
    }
  }
}
