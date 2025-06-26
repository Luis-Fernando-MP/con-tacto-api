import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import TTSService from 'src/tts/tts.service';
import { AiService } from 'src/ai/ai.service';

@Module({
  controllers: [StoryController],
  providers: [StoryService, AiService, TTSService],
})
export class StoryModule {}
