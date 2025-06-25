"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const ENV = {
    PORT: Number(process.env.PORT) || 3000,
    AI_KEY: process.env.AI_KEY,
    AI_MODEL: process.env.AI_MODEL,
};
exports.default = ENV;
//# sourceMappingURL=env.js.map