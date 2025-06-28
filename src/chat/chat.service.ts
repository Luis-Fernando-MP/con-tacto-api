import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { AiService } from 'src/ai/ai.service';
import TTSService from 'src/tts/tts.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly aiService: AiService,
    private readonly tts: TTSService,
  ) {}

  async create({ prompt, test, model }: CreateChatDto) {
    let response = await this.aiService.test();
    if (!test) response = await this.aiService.chat(prompt);

    return await this.tts.speak({
      text: response,
      model: model,
    });
  }

  async to_create({ prompt, test, model }: CreateChatDto) {
    let response = await this.aiService.test();
    if (!test) response = await this.aiService.chat(prompt);

    return {
      text: response,
      audio: await this.tts.speak({
        text: response,
        model: model,
      }),
    };
  }
}
