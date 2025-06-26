import { Message } from 'ai';
export declare class AiService {
    conversationHistory: Message[];
    private readonly openRouter;
    private readonly model;
    private readonly maxHistorySize;
    chat(message: string): Promise<string>;
    story(topic: string): Promise<string>;
    private getLastTwoConversations;
    private generateResponse;
    private trimHistory;
    test(): Promise<string>;
}
