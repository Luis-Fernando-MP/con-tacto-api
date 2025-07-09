import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { AiService } from 'src/services/ai/ai.service';
import TTSService from 'src/services/tts/tts.service';

@Injectable()
export class StoryService {
  constructor(
    private readonly aiService: AiService,
    private readonly tts: TTSService,
  ) {}

  async create({ topic, model, test }: CreateStoryDto) {
    let response = await this.aiService.test();
    if (!test) response = await this.aiService.story(topic);

    return await this.tts.speak({
      text: response,
      model: model,
    });
  }
}
