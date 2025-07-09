import { EdgeTTS } from '@andresaya/edge-tts';
import { Injectable } from '@nestjs/common';
import { VoiceModels } from './VoiceModels';

interface Speak {
  text: string;
  model?: string;
  volume?: string;
  pitch?: string;
  rate?: string;
}

@Injectable()
export default class TTSService {
  public async voices() {
    const tts = new EdgeTTS();
    return await tts.getVoices();
  }

  public async speak({
    text,
    model = VoiceModels.AlexNeural,
    volume = '10%',
    pitch = '0Hz',
    rate = '0%',
  }: Speak) {
    const tts = new EdgeTTS();
    console.log({ model, volume, pitch, rate });
    await tts.synthesize(text, model, {
      rate, // Más rápido (puedes probar hasta 100%)
      volume, // Volumen neutro
      pitch, // Más agudo (puedes ajustar hasta 100Hz si quieres algo muy agudo)
    });

    return tts.toBase64();
  }
}
