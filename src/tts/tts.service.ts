import { Injectable } from '@nestjs/common';
import { CreateTtsDto } from './dto/create-tts.dto';
import TTSService from 'src/services/tts/tts.service';

@Injectable()
export class TtsService {
  constructor(private readonly tts: TTSService) {}

  async generate({ model, prompt, ...ttsOptions }: CreateTtsDto) {
    return await this.tts.speak({
      text: prompt,
      model: model,
      ...ttsOptions,
    });
  }
}
