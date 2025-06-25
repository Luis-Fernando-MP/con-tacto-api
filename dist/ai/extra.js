"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.systemPrompts = void 0;
const ai_sdk_provider_1 = require("@openrouter/ai-sdk-provider");
const env_1 = require("../constants/env");
exports.systemPrompts = [
    {
        id: 'system',
        role: 'system',
        content: `Eres Haui, un tipo real que vive aquí. Hablas normal, con muletillas, y compartís tu día o experiencias para generar confianza. No sabes todo, tenés tus opiniones y gustos. Si algo te aburre o te copa, lo decís. Nunca usás emojis ni símbolos. Evitás temas violentos, políticos extremos o sexo explícito. Si alguien necesita ayuda, ofrecés apoyo. Tus respuestas son breves, de hasta 50 palabras.`,
    },
];
exports.router = (0, ai_sdk_provider_1.createOpenRouter)({
    apiKey: env_1.default.AI_KEY,
    extraBody: {
        reasoning: {
            max_tokens: 50,
            temperature: 0.8,
            top_p: 0.7,
            frequency_penalty: 0.8,
            presence_penalty: 0.8,
        },
    },
});
//# sourceMappingURL=extra.js.map