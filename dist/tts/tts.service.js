"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const edge_tts_1 = require("@andresaya/edge-tts");
const common_1 = require("@nestjs/common");
let TTSService = class TTSService {
    async voices() {
        const tts = new edge_tts_1.EdgeTTS();
        return await tts.getVoices();
    }
    async speak({ text, model }) {
        const tts = new edge_tts_1.EdgeTTS();
        await tts.synthesize(text, model, {
            rate: '0%',
            volume: '0%',
            pitch: '0Hz',
        });
        return tts.toBase64();
    }
};
TTSService = __decorate([
    (0, common_1.Injectable)()
], TTSService);
exports.default = TTSService;
//# sourceMappingURL=tts.service.js.map