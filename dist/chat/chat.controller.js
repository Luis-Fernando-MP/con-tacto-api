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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const swagger_1 = require("@nestjs/swagger");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async create(createChatDto) {
        const base64Audio = await this.chatService.create(createChatDto);
        const audioBuffer = Buffer.from(base64Audio, 'base64');
        return new common_1.StreamableFile(audioBuffer, {
            type: 'audio/mpeg',
            disposition: 'attachment; filename=output.mp3',
        });
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Envía un createChatDto para generar un respuesta de voz',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'El audio se ha creado correctamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Intenta de nuevo, debes de enviar mas despacio tus mensajes',
    }),
    (0, swagger_1.ApiBody)({ type: create_chat_dto_1.CreateChatDto }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "create", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('chat'),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map