import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { loggerGlobal } from './middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SIH - API Rest')
    .setDescription(
      `
¡Bienvenido a la API de SIH Esta API está diseñada para proporcionar acceso a una variedad de recursos relacionados con la gestión de los usuarios y sus funcionalidades en nuestra plataforma.
Esta API Rest esta desarrollada con NestJS, Typescript y como DB PostgreSQL.
La API requiere autenticación para ciertas operaciones. Se usilizo JWT para autenticar a los usuarios.
Para obtener un token JWT, inicia sesión utilizando el endpoint /auth/signin.
`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.use(loggerGlobal); // midd-loginLog global
  // app.use(auth(configAuth0)); // auth0
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validar DTO
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
