import { EdgeTTS } from '@andresaya/edge-tts';
import { Injectable } from '@nestjs/common';
import { VoiceModels } from './VoiceModels';

import * as streamBuffers from 'stream-buffers';

import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { Readable } from 'stream';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

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
    await tts.synthesize(text, model, {
      rate, // Más rápido (puedes probar hasta 100%)
      volume, // Volumen neutro
      pitch, // Más agudo (puedes ajustar hasta 100Hz si quieres algo muy agudo)
    });

    return tts.toBase64();
  }

  public convertToWav(inputBuffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // Convierte el buffer a un stream legible
      const inputStream = Readable.from(inputBuffer);

      // Buffer donde se almacenará el resultado final
      const outputBuffer = new streamBuffers.WritableStreamBuffer();

      ffmpeg(inputStream)
        .inputFormat('mp3') // Entrada esperada: MP3 en este caso
        .audioCodec('pcm_u8') // Usa un códec PCM de 8 bits para menor peso
        .audioFrequency(8000) // Reduce la frecuencia de muestreo a 8kHz (suficiente para voz)
        .format('wav') // Salida en formato WAV
        .outputOptions([
          '-ac',
          '1', // Audio en mono: más liviano que estéreo
          '-ar',
          '8000', // Frecuencia de muestreo a 8000 Hz
          '-sample_fmt',
          'u8', // Fuerza el formato de muestra a 8-bit unsigned
          '-fflags',
          '+bitexact', // Precisión exacta en los bits
          '-flags:v',
          '+bitexact', // Igual, pero en stream de video (no aplica mucho, pero evita warnings)
          '-write_bext',
          '0', // Elimina metadatos de difusión (BEXT)
          '-map_metadata',
          '-1', // Borra todos los metadatos del archivo
        ])
        .on('error', reject) // Si falla, lanza error
        .on('end', () => {
          // Al finalizar, retorna el buffer generado
          const buffer = outputBuffer.getContents();
          resolve(buffer);
        })
        // Escribe el archivo final en el buffer
        .writeToStream(outputBuffer);
    });
  }
}
