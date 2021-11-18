import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfgf } from 'config/database.config';
import { AppController } from './app.controller';
import { AdministratorController } from './controllers/api/administrator.controller';
import { Administrator } from './entities/administrator';
import { AdministratorService } from './services/administrator.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfgf.hostname,
      port: 3306,
      username: DatabaseConfgf.username,
      password: DatabaseConfgf.password,
      database: DatabaseConfgf.database,
      entities: [
        Administrator,
      ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
    ])
  ],
  controllers: [
    AppController,
    AdministratorController
  ],
  providers: [AdministratorService],
})
export class AppModule {}
