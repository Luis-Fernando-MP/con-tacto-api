import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AiService } from 'src/services/ai/ai.service';
import TTSService from 'src/services/tts/tts.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, AiService, TTSService],
  exports: [ChatService],
})
export class ChatModule {}
