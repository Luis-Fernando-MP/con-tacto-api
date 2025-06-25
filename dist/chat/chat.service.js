"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai/ai.service");
const VoiceModels_1 = require("../tts/VoiceModels");
const tts_service_1 = require("../tts/tts.service");
let ChatService = class ChatService {
    aiService;
    tts;
    constructor(aiService, tts) {
        this.aiService = aiService;
        this.tts = tts;
    }
    async create({ prompt, test, model }) {
        let response = await this.aiService.test(prompt);
        if (!test)
            response = await this.aiService.chat(prompt);
        return await this.tts.speak({
            text: response,
            model: model ?? VoiceModels_1.VoiceModels.AlexNeural,
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        tts_service_1.default])
], ChatService);
//# sourceMappingURL=chat.service.js.map