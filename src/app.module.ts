import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiServiceService } from './ai-service/ai-service.service';
import { AiService } from './ai/ai.service';
import { ChatModule } from './chat/chat.module';
import { ChatResolver } from './chat/chat.resolver';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [AppController],
  providers: [AppService, AiServiceService, AiService, ChatResolver],
})
export class AppModule {}
