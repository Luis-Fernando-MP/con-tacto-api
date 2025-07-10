import { Controller, Post, Body, StreamableFile } from '@nestjs/common';
import { TtsService } from './tts.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateTtsDto } from './dto/create-tts.dto';

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
    const wavBuffer = await this.ttsService.generate(createTtsDto);

    return new StreamableFile(wavBuffer, {
      type: 'audio/wav',
      disposition: 'attachment; filename=output.wav',
    });
  }
}
