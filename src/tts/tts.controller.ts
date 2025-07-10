import { Controller, Post, Body, StreamableFile } from '@nestjs/common';
import { TtsService } from './tts.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { Readable } from 'stream';
import * as streamBuffers from 'stream-buffers';
import { CreateTtsDto } from './dto/create-tts.dto';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@ApiTags('tts')
@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @ApiOperation({
    summary:
      'Envía un CreateTtsDto para transformar tu texto a un respuesta de voz',
  })
  @ApiResponse({
    status: 201,
    description: 'El audio se ha creado correctamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Intenta de nuevo, debes de enviar mas despacio tus mensajes',
  })
  @ApiBody({ type: CreateTtsDto })
  @Post()
  @Post()
  async create(@Body() createTtsDto: CreateTtsDto) {
    const base64Audio = await this.ttsService.generate(createTtsDto);
    const inputBuffer = Buffer.from(base64Audio, 'base64');

    const wavBuffer = await this.convertToWav(inputBuffer);

    return new StreamableFile(wavBuffer, {
      type: 'audio/wav',
      disposition: 'attachment; filename=output.wav',
    });
  }

  private convertToWav(inputBuffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const inputStream = Readable.from(inputBuffer);
      const outputBuffer = new streamBuffers.WritableStreamBuffer();

      ffmpeg(inputStream)
        .inputFormat('mp3')
        .audioCodec('pcm_u8')
        .audioFrequency(8000)
        .format('wav')
        .outputOptions([
          '-ac',
          '1', // Mono
          '-ar',
          '8000', // 8000 Hz
          '-f',
          'wav', // WAV contenedor fijo
          '-fflags',
          '+bitexact',
          '-flags:v',
          '+bitexact',
          '-write_bext',
          '0', // Quita metadata BEXT (broadcast extension)
        ])
        .on('error', reject)
        .on('end', () => {
          const buffer = outputBuffer.getContents();
          resolve(buffer);
        })
        .writeToStream(outputBuffer);
    });
  }
}
