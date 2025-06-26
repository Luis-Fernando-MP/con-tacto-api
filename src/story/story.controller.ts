import { Controller, Post, Body, StreamableFile } from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @ApiOperation({
    summary: 'Envía un CreateStoryDto para generar un historia o podcast a voz',
  })
  @ApiResponse({
    status: 201,
    description: 'El audio se ha creado correctamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Intenta de nuevo, debes de enviar mas despacio tus mensajes',
  })
  @ApiBody({ type: CreateStoryDto })
  @Post()
  async create(@Body() createStoryDto: CreateStoryDto) {
    const base64Audio = await this.storyService.create(createStoryDto);
    const audioBuffer = Buffer.from(base64Audio, 'base64');

    return new StreamableFile(audioBuffer, {
      type: 'audio/mpeg',
      disposition: 'attachment; filename=output.mp3',
    });
  }
}
