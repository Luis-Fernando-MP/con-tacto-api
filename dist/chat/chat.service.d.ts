import { CreateChatDto } from './dto/create-chat.dto';
import { AiService } from 'src/ai/ai.service';
import TTSService from 'src/tts/tts.service';
export declare class ChatService {
    private readonly aiService;
    private readonly tts;
    constructor(aiService: AiService, tts: TTSService);
    create({ prompt, test, model }: CreateChatDto): Promise<string>;
}
