import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.enableCors({
    origin: 'http://localhost:4200', // O pon true / '*' para permitir cualquier origen durante desarrollo
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // Configuración de la documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Monitor de Avance')
    .setDescription('Documentación automática de la API para el sistema de seguimiento')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Ruta donde estará disponible la interfaz visual (ej: http://localhost:3000/api)
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
