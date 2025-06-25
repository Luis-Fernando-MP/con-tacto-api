"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const env_1 = require("./constants/env");
const constants_1 = require("./constants");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: constants_1.default.origins,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Con-Tacto API')
        .setDescription('API de Con-Tacto')
        .setVersion('1.0')
        .addTag('con-tacto')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    common_1.Logger.log(`🚀 server is running on port http://localhost:${env_1.default.PORT}/api`);
    await app.listen(env_1.default.PORT);
}
void bootstrap();
//# sourceMappingURL=main.js.map