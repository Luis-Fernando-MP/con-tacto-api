import { Controller, Post, Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Response } from 'express';
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
  async create(@Body() createChatDto: CreateChatDto, @Res() res: Response) {
    const base64Audio = await this.chatService.create(createChatDto);
    //El controlador recibe el audio en base64 del servicio y lo convierte a un buffer
    const audioBuffer = Buffer.from(base64Audio, 'base64');

    // Configura los headers de la respuesta para indicar que el contenido es un archivo MP3 y establece el nombre del archivo.
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename=output.mp3');
    // Envío del buffer del audio: Envía el buffer del audio como respuesta.
    res.send(audioBuffer);
  }
}
