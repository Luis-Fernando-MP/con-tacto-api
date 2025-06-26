import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { VoiceModels } from 'src/tts/VoiceModels';

@ApiSchema({
  name: 'CreateStoryDto',
  description:
    'Crea una historia o podcast con un tópico simple, y obtén el audio de voz',
})
export class CreateStoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  topic: string;

  @ApiProperty({
    required: false,
    default: false,
    description:
      'Si estas en desarrollo usa true para mayor rapidez y no incurrir en más gastos',
  })
  @IsOptional()
  @IsBoolean()
  test?: boolean = false;

  @ApiProperty({
    enum: VoiceModels,
    required: false,
    default: VoiceModels.AlexNeural,
    isArray: false,
  })
  @IsOptional()
  @IsEnum(VoiceModels)
  model?: string;
}
