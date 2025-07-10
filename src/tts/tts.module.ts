import { Module } from '@nestjs/common';
import { TtsService } from './tts.service';
import { TtsController } from './tts.controller';
import TTSSpeakService from 'src/services/tts/tts.service';

@Module({
  controllers: [TtsController],
  providers: [TtsService, TTSSpeakService],
})
export class TtsModule {}
