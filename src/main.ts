import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Turma')
    .setDescription(
      [
        'API para criar turmas e gerenciar vinculos de professores e alunos.',
        '',
        'Fluxo basico:',
        '1. Crie uma turma em `POST /classrooms`.',
        '2. Vincule professores ou alunos usando o UUID retornado.',
        '3. Consulte a turma e seus membros pelas rotas de listagem.',
      ].join('\n'),
    )
    .setVersion('1.0.0')
    .addTag('Status', 'Verificacao de disponibilidade da API')
    .addTag('Turmas', 'Criacao, consulta e gerenciamento de membros')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documentFactory, {
    customSiteTitle: 'API Turma - Documentacao',
    jsonDocumentUrl: 'docs/openapi.json',
    yamlDocumentUrl: 'docs/openapi.yaml',
    swaggerOptions: {
      displayRequestDuration: true,
      operationsSorter: 'method',
    },
  });

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  console.log(`Khora API running on http://localhost:${port}`);
  console.log(`Swagger available on http://localhost:${port}/docs/`);
}

bootstrap();
