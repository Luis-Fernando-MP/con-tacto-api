import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { StoryModule } from './story/story.module';

@Module({
  imports: [ChatModule, StoryModule],
})
export class AppModule {}
