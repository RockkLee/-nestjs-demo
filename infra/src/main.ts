import { NestFactory } from '@nestjs/core';
import { AppModule } from '@nestjs-demo/infra/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

// import { tempApp } from "@nestjs-demo/app/temp";
// import { User } from "@nestjs-demo/domain/entity/user";
// import { UserAppSvc } from "@nestjs-demo/app/app.svc/user.app.svc";

// console.log(tempApp);
// console.log(User);
// console.log(UserAppSvc);