import { Controller, Post, Body, StreamableFile } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  async create(@Body() createChatDto: CreateChatDto) {
    const base64Audio = await this.chatService.create(createChatDto);
    const audioBuffer = Buffer.from(base64Audio, 'base64');

    return new StreamableFile(audioBuffer, {
      type: 'audio/mpeg',
      disposition: 'attachment; filename=output.mp3',
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
