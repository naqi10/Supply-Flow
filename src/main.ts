import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  setupSwagger(app);

  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
  console.log(`📑 Swagger docs: http://localhost:3000/api/docs`);
}
bootstrap();
