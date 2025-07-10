import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ChatModule } from 'src/chat/chat.module';
import TTSService from 'src/services/tts/tts.service';

@Module({
  providers: [SocketGateway, TTSService],
  imports: [ChatModule],
})
export class SocketModule {}
