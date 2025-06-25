"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const ai_1 = require("ai");
const extra_1 = require("./extra");
const env_1 = require("../constants/env");
let AiService = class AiService {
    conversationHistory = [...extra_1.systemPrompts];
    openRouter = extra_1.router;
    model = this.openRouter(env_1.default.AI_MODEL);
    maxHistorySize = 10;
    async chat(message) {
        const newMessage = {
            role: 'user',
            content: message,
            id: String(this.conversationHistory.length + 1),
        };
        this.conversationHistory.push(newMessage);
        this.trimHistory();
        try {
            const { text } = await (0, ai_1.generateText)({
                model: this.model,
                messages: this.conversationHistory,
            });
            const botMessage = {
                role: 'assistant',
                content: text,
                id: String(this.conversationHistory.length + 1),
            };
            this.conversationHistory.push(botMessage);
            this.trimHistory();
            return text;
        }
        catch (error) {
            console.error('Error al generar la respuesta:', error);
            throw new Error('Hubo un problema al generar la respuesta. Por favor, inténtalo de nuevo más tarde.');
        }
    }
    trimHistory() {
        if (this.conversationHistory.length <= this.maxHistorySize)
            return;
        this.conversationHistory = this.conversationHistory.slice(-this.maxHistorySize);
    }
    async test(message) {
        const newMessage = {
            role: 'user',
            content: message,
            id: String(this.conversationHistory.length + 1),
        };
        this.conversationHistory.push(newMessage);
        this.trimHistory();
        const simulatedResponse = `Respuesta simulada: El absurdo es esa sensación de que todo tiene sentido hasta que te das cuenta de que no lo tiene. Es como cuando ves que la gente hace cosas que no entiendes, pero no por falta de lógica, sino porque cada quien tiene su propia forma de ver el mundo.`;
        const botMessage = {
            role: 'assistant',
            content: simulatedResponse,
            id: String(this.conversationHistory.length + 1),
        };
        this.conversationHistory.push(botMessage);
        this.trimHistory();
        return await new Promise((resolve) => {
            setTimeout(() => {
                resolve(simulatedResponse);
            }, 100);
        });
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map