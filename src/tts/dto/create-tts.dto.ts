import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';
import { VoiceModels } from 'src/services/tts/VoiceModels';

@ApiSchema({
  name: 'CreateChatDto',
  description: 'Crea un nuevo chat con un prompt y una voz de texto',
})
export class CreateTtsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    enum: VoiceModels,
    required: false,
    default: VoiceModels.AlexNeural,
    isArray: false,
  })
  @IsOptional()
  @IsEnum(VoiceModels)
  model?: string;

  @ApiProperty({
    required: false,
    default: '10%',
    description: 'Porcentaje de volumen (ej. "10%")',
  })
  @IsOptional()
  @Matches(/^-?\d+%$/, {
    message: 'El volumen debe ser un string como "10%" o "20%"',
  })
  volume?: string;

  @ApiProperty({
    required: false,
    default: '0Hz',
    description: 'Tono de voz en Hertz (ej. "0Hz", "100Hz")',
  })
  @IsOptional()
  @Matches(/^-?\d+Hz$/, {
    message: 'El tono debe ser un string como "0Hz" o "100Hz"',
  })
  pitch?: string;

  @ApiProperty({
    required: false,
    default: '0%',
    description: 'Velocidad de voz en porcentaje (ej. "0%", "-50%")',
  })
  @IsOptional()
  @Matches(/^-?\d+%$/, {
    message: 'La velocidad debe ser un string como "0%" o "50%"',
  })
  rate?: string;
}
