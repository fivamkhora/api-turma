# API Turma

Backend do projeto Khora/FIVAM para gerenciamento de turmas, desenvolvido com NestJS, TypeScript, PostgreSQL e TypeORM.

## Tecnologias

- Node.js 22
- NestJS 11
- TypeScript
- PostgreSQL
- TypeORM
- Jest
- Docker

## Requisitos

- Node.js 22 ou superior
- npm
- PostgreSQL
- Docker, opcional para build da imagem

## Instalacao

```bash
npm install
```

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as variaveis abaixo:

```env
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=khora_user
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=khora
```

Observacoes:

- `PORT` e opcional. Se nao for informado, a API usa `3000`.
- O TypeORM esta configurado com `synchronize: true`, entao as tabelas sao sincronizadas automaticamente em tempo de execucao. Em producao, avalie trocar para migrations.

## Executar a aplicacao

### Desenvolvimento

```bash
npm run start:dev
```

### Producao local

```bash
npm run build
npm run start:prod
```

### Testes

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Docker

Build da imagem:

```bash
docker build -f docker/Dockerfile -t api-turma .
```

Execucao do container:

```bash
docker run --rm -p 3000:3000 --env-file .env api-turma
```

## URL base

Em desenvolvimento local:

```text
http://localhost:3000
```

## Rotas da API

### Health check simples

```http
GET /
```

Resposta:

```text
Hello World!
```

### Criar turma

```http
POST /classrooms
Content-Type: application/json
```

Body:

```json
{
  "name": "Turma 1A",
  "schoolYear": "2026",
  "teacherId": 1
}
```

Validacoes:

- `name`: obrigatorio, string
- `schoolYear`: obrigatorio, string
- `teacherId`: obrigatorio, number

Resposta esperada:

```json
{
  "id": "uuid-da-turma",
  "name": "Turma 1A",
  "code": "TURMA-ABC123",
  "schoolYear": "2026",
  "teacherId": 1,
  "createdAt": "2026-06-28T00:00:00.000Z",
  "updatedAt": "2026-06-28T00:00:00.000Z"
}
```

O campo `code` e gerado automaticamente no formato `TURMA-XXXXXX`.

### Listar turmas

```http
GET /classrooms
```

Resposta esperada:

```json
[
  {
    "id": "uuid-da-turma",
    "name": "Turma 1A",
    "code": "TURMA-ABC123",
    "schoolYear": "2026",
    "teacherId": 1,
    "createdAt": "2026-06-28T00:00:00.000Z",
    "updatedAt": "2026-06-28T00:00:00.000Z"
  }
]
```

### Vincular professor a uma turma

```http
POST /classrooms/:id/teachers
Content-Type: application/json
```

Parametros:

- `id`: uuid da turma

Body:

```json
{
  "userId": 10
}
```

Validacoes:

- `userId`: obrigatorio, number

Resposta esperada:

```json
{
  "id": "uuid-do-vinculo",
  "classroomId": "uuid-da-turma",
  "userId": 10,
  "role": "Professor",
  "createdAt": "2026-07-05T00:00:00.000Z"
}
```

Erros possiveis:

- `404 Not Found`: turma nao encontrada
- `409 Conflict`: usuario ja vinculado a esta turma

### Vincular aluno a uma turma

```http
POST /classrooms/:id/students
Content-Type: application/json
```

Parametros:

- `id`: uuid da turma

Body:

```json
{
  "userId": 25
}
```

Validacoes:

- `userId`: obrigatorio, number

Resposta esperada:

```json
{
  "id": "uuid-do-vinculo",
  "classroomId": "uuid-da-turma",
  "userId": 25,
  "role": "Aluno",
  "createdAt": "2026-07-05T00:00:00.000Z"
}
```

Erros possiveis:

- `404 Not Found`: turma nao encontrada
- `409 Conflict`: usuario ja vinculado a esta turma

## Modelo de dados

### Classroom

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `id` | uuid | Identificador unico da turma |
| `name` | string | Nome da turma |
| `code` | string | Codigo unico gerado automaticamente |
| `schoolYear` | string | Ano letivo |
| `teacherId` | number | Identificador do professor responsavel |
| `createdAt` | Date | Data de criacao |
| `updatedAt` | Date | Data da ultima atualizacao |

### ClassroomMember

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `id` | uuid | Identificador unico do vinculo |
| `classroomId` | string | Identificador da turma |
| `userId` | number | Identificador do usuario vinculado |
| `role` | `Professor` ou `Aluno` | Papel do usuario dentro da turma |
| `createdAt` | Date | Data de criacao do vinculo |

Restricoes:

- A combinacao `classroomId` + `userId` deve ser unica.
- O mesmo usuario nao pode ser vinculado duas vezes a mesma turma.

## Estrutura do sistema

```text
src/
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
  classrooms/
    classrooms.controller.ts
    classrooms.module.ts
    classrooms.service.ts
    dto/
      add-classroom-member.dto.ts
      create-classroom.dto.ts
    entities/
      classroom-member.entity.ts
      classroom.entity.ts
```

## Modulos

- `AppModule`: modulo raiz, carrega variaveis de ambiente e configura conexao com PostgreSQL.
- `ClassroomsModule`: modulo responsavel pelas rotas e regras de turmas.
- `ClassroomsController`: expoe os endpoints REST de turmas.
- `ClassroomsService`: executa criacao, listagem, vinculo de professores/alunos e geracao do codigo da turma.
- `Classroom`: entidade TypeORM persistida na tabela `classrooms`.
- `ClassroomMember`: entidade TypeORM persistida na tabela `classroom_members`.

## CI/CD

O workflow do GitHub Actions executa:

- instalacao de dependencias
- testes com Jest
- scan de vulnerabilidades com Trivy
- build e push da imagem Docker em pushes para `main` ou tags
- deploy no Render quando as credenciais estiverem configuradas

## Equipe

Projeto desenvolvido pela equipe FIVAM/Khora.
