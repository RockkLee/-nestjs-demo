import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@nestjs-demo/infra/app.controller';
import { AppService } from '@nestjs-demo/infra/app.service';

import { UserModule } from '@nestjs-demo/infra/module/user.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite', // or 'postgres', 'mysql', etc.
            database: 'database.sqlite', // For SQLite
            entities: [__dirname + '/../**/*.orm{.ts,.js}'],
            synchronize: true, // Set to false in production
        }),
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
