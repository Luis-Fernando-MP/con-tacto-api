import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AiService } from '../ai/ai.service';
import TTSService from '../tts/tts.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, AiService, TTSService],
})
export class ChatModule {}
