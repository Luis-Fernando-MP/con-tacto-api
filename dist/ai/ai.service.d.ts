import { Message } from 'ai';
export declare class AiService {
    conversationHistory: Message[];
    private readonly openRouter;
    private readonly model;
    private readonly maxHistorySize;
    chat(message: string): Promise<string>;
    private trimHistory;
    test(message: string): Promise<string>;
}
