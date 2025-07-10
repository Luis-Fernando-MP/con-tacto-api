import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { StoryModule } from './story/story.module';
import { SocketModule } from './socket/socket.module';
import { TtsModule } from './tts/tts.module';

@Module({
  imports: [ChatModule, StoryModule, SocketModule, TtsModule],
})
export class AppModule {}
