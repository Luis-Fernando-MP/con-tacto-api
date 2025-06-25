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
exports.CreateChatDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const VoiceModels_1 = require("../../tts/VoiceModels");
let CreateChatDto = class CreateChatDto {
    prompt;
    test = false;
    model;
};
exports.CreateChatDto = CreateChatDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "prompt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        default: false,
        description: 'Si estas en desarrollo usa true para mayor rapidez y no incurrir en más gastos',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateChatDto.prototype, "test", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: VoiceModels_1.VoiceModels,
        required: false,
        default: VoiceModels_1.VoiceModels.AlexNeural,
        isArray: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(VoiceModels_1.VoiceModels),
    __metadata("design:type", String)
], CreateChatDto.prototype, "model", void 0);
exports.CreateChatDto = CreateChatDto = __decorate([
    (0, swagger_1.ApiSchema)({
        name: 'CreateChatDto',
        description: 'Crea un nuevo chat con un prompt y una voz de texto',
    })
], CreateChatDto);
//# sourceMappingURL=create-chat.dto.js.map