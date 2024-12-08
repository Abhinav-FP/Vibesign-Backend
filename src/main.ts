import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/jwt.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Ensure all endpoints are protected from invalid data
    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
    app.useGlobalGuards(new JwtGuard(app.get(Reflector)));

    app.enableCors({
        origin: "*"
    })

    // Create swagger docs
    const config = new DocumentBuilder()
        .setTitle('Vibesign')
        .setDescription('The nest backend for vibesign')
        .setVersion('1.0')
        .addTag('vibesign')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger-ui', app, documentFactory, {
        jsonDocumentUrl: 'api-docs',
    });

    // Listen
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(e => {
    console.error(`Vibesign Nest app failed to bootstrap`, e);
});
