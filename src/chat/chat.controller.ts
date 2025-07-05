import { Controller, Post, Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { Readable } from 'stream';
import { Response } from 'express';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: 'Envía un createChatDto para generar un respuesta de voz',
  })
  @ApiResponse({
    status: 201,
    description: 'El audio se ha creado correctamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Intenta de nuevo, debes de enviar mas despacio tus mensajes',
  })
  @ApiBody({ type: CreateChatDto })
  @Post()
  @Post()
  async create(@Body() createChatDto: CreateChatDto, @Res() res: Response) {
    const base64Audio = await this.chatService.create(createChatDto);
    const inputBuffer = Buffer.from(base64Audio, 'base64');

    const wavBuffer = await this.convertToWav(inputBuffer);

    res.set({
      'Content-Type': 'audio/wav',
      'Content-Length': wavBuffer.length,
    });

    res.send(wavBuffer);
    // Prev config
    // return new StreamableFile(wavBuffer, {
    //   type: 'audio/wav',
    //   disposition: 'attachment; filename=output.wav',
    // });
  }

  private convertToWav(inputBuffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const inputStream = Readable.from(inputBuffer);

      ffmpeg(inputStream)
        .inputFormat('mp3')
        .audioCodec('pcm_u8')
        .audioFrequency(8000)
        .format('wav')
        .on('error', reject)
        .on('end', () => {
          const result = Buffer.concat(chunks);
          resolve(result);
        })
        .pipe()
        .on('data', (chunk: Buffer) => chunks.push(chunk));
    });
  }

  @ApiOperation({
    summary: 'Envía un createChatDto para generar un respuesta de voz',
  })
  @ApiResponse({
    status: 201,
    description: 'El audio se ha creado correctamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Intenta de nuevo, debes de enviar mas despacio tus mensajes',
  })
  @ApiBody({ type: CreateChatDto })
  @Post('to-hex')
  async to_hex(@Body() createChatDto: CreateChatDto) {
    const base64Audio = await this.chatService.create(createChatDto);

    const buffer = Buffer.from(base64Audio, 'base64');

    // 1. Convierte cada byte a 0xHH (asegura tipo: string[])
    const hexArray: string[] = Array.from(buffer).map(
      (byte: number) => `0x${byte.toString(16).padStart(2, '0')}`,
    );

    // 2. Divide en líneas tipo C (chunked output)
    const lines: string[] = [];
    const chunkSize = 16;

    for (let i = 0; i < hexArray.length; i += chunkSize) {
      const chunkLine = hexArray.slice(i, i + chunkSize).join(', ');
      lines.push(chunkLine);
    }

    // 3. Formato final para código C
    const result = `uint8_t audio[] = {\n  ${lines.join(',\n  ')}\n};`;

    return { hexCFormatted: result };
  }
}
