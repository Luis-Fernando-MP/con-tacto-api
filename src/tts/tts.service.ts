import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTtsDto } from './dto/create-tts.dto';
import TTSService from 'src/services/tts/tts.service';

@Injectable()
export class TtsService {
  constructor(private readonly tts: TTSService) {}

  async generate({ model, prompt, ...ttsOptions }: CreateTtsDto) {
    try {
      const base64Audio = await this.tts.speak({
        text: prompt,
        model: model,
        ...ttsOptions,
      });

      const inputBuffer = Buffer.from(base64Audio, 'base64');
      const wavBuffer = await this.tts.convertToWav(inputBuffer);

      return wavBuffer;
    } catch (e) {
      console.log('error:', e?.message);
      throw new InternalServerErrorException(
        'Error al procesar el archivo wav',
      );
    }
  }
}
