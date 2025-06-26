interface Speak {
    text: string;
    model?: string;
}
export default class TTSService {
    voices(): Promise<any[]>;
    speak({ text, model }: Speak): Promise<string>;
}
export {};
