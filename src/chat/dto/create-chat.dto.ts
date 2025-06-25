import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { VoiceModels } from 'src/tts/VoiceModels';

@ApiSchema({
  name: 'CreateChatDto',
  description: 'Crea un nuevo chat con un prompt y una voz de texto',
})
export class CreateChatDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  prompt: string;

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
