import { EdgeTTS } from '@andresaya/edge-tts';
import { Injectable } from '@nestjs/common';

interface Speak {
  text: string;
  model: string;
}

@Injectable()
export default class TTSService {
  public async voices() {
    const tts = new EdgeTTS();
    return await tts.getVoices();
  }

  public async speak({ text, model }: Speak) {
    const tts = new EdgeTTS();
    await tts.synthesize(text, model, {
      rate: '0%', // Speech rate (range: -100% to 100%)
      volume: '0%', // Speech volume (range: -100% to 100%)
      pitch: '0Hz', // Voice pitch (range: -100Hz to 100Hz)
    });

    return tts.toBase64();
  }
}
