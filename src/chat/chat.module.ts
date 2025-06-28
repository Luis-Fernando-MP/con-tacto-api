import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AiService } from 'src/ai/ai.service';
import TTSService from 'src/tts/tts.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, AiService, TTSService],
  exports: [ChatService],
})
export class ChatModule {}
