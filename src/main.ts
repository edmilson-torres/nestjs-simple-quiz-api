import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const configService = app.get(ConfigService)
    app.enableCors()
    app.use(helmet())
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true
        })
    )

    const config = new DocumentBuilder()
        .setTitle('Simple Quiz')
        .setDescription('Quiz')
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document, {
        jsonDocumentUrl: 'docs-json'
    })

    await app.listen(
        configService.get<number>('PORT', { infer: true }) || 3000,
        '0.0.0.0'
    )

    console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()
