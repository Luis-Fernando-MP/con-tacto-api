import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { StoryModule } from './story/story.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [ChatModule, StoryModule, SocketModule],
})
export class AppModule {}
