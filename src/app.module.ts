import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfgf } from 'config/database.config';
import { AppController } from './controllers/app.controller';
import { AdministratorController } from './controllers/api/administrator.controller';
import { AdministratorService } from './services/administrator.service';
import { KorisnikController } from './controllers/api/korisnik.contriller';
import { KorisnikService } from './services/korisnik/korisnik.service';
import { Administrator } from './entities/administrator';
import { Beleska } from './entities/beleska';
import { Korisnik } from './entities/korisnik';
import { Kontakt } from './entities/kontakt';
import { KorisnikToken } from './entities/korisnik-token';
import { Dogadjaj } from './entities/dogadjaj';
import { Fotografija } from './entities/fotografija';
import { Mesto } from './entities/mesto';
import { Zadatak } from './entities/zadatak';
import { Telefon } from './entities/telefon';
import { KontaktController } from './controllers/api/kontakt.controller';
import { KontaktService } from './services/kontakt/kontakt.service';
import { TelefonController } from './controllers/api/telefon.controller';
import { TelefonService } from './services/telefon/telefon.service';

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
        Beleska,
        Korisnik,
        Kontakt,
        KorisnikToken,
        Dogadjaj,
        Fotografija,
        Mesto,
        Zadatak,
        Telefon
      ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
      Beleska,
      Korisnik,
      Kontakt,
      KorisnikToken,
      Dogadjaj,
      Fotografija,
      Mesto,
      Zadatak,
      Telefon
    ])
  ],
  controllers: [
    AppController,
    AdministratorController,
    KorisnikController,
    KontaktController,
    TelefonController,
  ],
  providers: [
    AdministratorService,
    KorisnikService,
    KontaktService,
    TelefonService,
  ],
})
export class AppModule {}
