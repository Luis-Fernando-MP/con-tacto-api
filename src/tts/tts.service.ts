import { EdgeTTS } from '@andresaya/edge-tts';
import { Injectable } from '@nestjs/common';
import { VoiceModels } from './VoiceModels';

interface Speak {
  text: string;
  model?: string;
}

@Injectable()
export default class TTSService {
  public async voices() {
    const tts = new EdgeTTS();
    return await tts.getVoices();
  }

  public async speak({ text, model = VoiceModels.AlexNeural }: Speak) {
    const tts = new EdgeTTS();
    await tts.synthesize(text, model, {
      rate: '70%', // Más rápido (puedes probar hasta 100%)
      volume: '30%', // Volumen neutro
      pitch: '70Hz', // Más agudo (puedes ajustar hasta 100Hz si quieres algo muy agudo)
    });

    return tts.toBase64();
  }
}
