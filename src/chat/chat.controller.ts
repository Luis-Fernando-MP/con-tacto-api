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
  async create(@Body() createChatDto: CreateChatDto) {
    const base64Audio = await this.chatService.create(createChatDto);
    const audioBuffer = Buffer.from(base64Audio, 'base64');

    return new StreamableFile(audioBuffer, {
      type: 'audio/mpeg',
      disposition: 'attachment; filename=output.mp3',
    });
  }
}
