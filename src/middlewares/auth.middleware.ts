import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from "jsonwebtoken"
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { jwtSecret } from "config/jwt.secret";
import { KorisnikService } from "src/services/korisnik/korisnik.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        public readonly administratorService: AdministratorService,
        public readonly korisnikService: KorisnikService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            throw new HttpException('Token nije pronađen', HttpStatus.UNAUTHORIZED)
        }
        
        const token = req.headers.authorization;

        const tokenDelovi = token.split(' ')
        if (tokenDelovi.length !== 2) {
            throw new HttpException('Pogrešan token', HttpStatus.UNAUTHORIZED)
        }

        const tokenString = tokenDelovi[1]

        let jwtData: JwtDataDto;

        try {
            jwtData = jwt.verify(tokenString, jwtSecret)
        } catch (e) {
            throw new HttpException('Token nije pronađen', HttpStatus.UNAUTHORIZED)
        }
        
        if (!jwtData) {
            throw new HttpException('Pogrešan token', HttpStatus.UNAUTHORIZED)
        }

        if (jwtData.ip !== req.ip.toString()) {
            throw new HttpException('Netačna IP adresa', HttpStatus.UNAUTHORIZED)
        }

        if (jwtData.ua !== req.headers['user-agent']) {
            throw new HttpException('Netačne informacije i user-agentu', HttpStatus.UNAUTHORIZED)
        }

        switch(jwtData.role) {
            case "administrator":
                const administrator = await this.administratorService.jedanAdministrator(jwtData.id)
            if (!administrator) {
                throw new HttpException('Nije pronađen administrator', HttpStatus.UNAUTHORIZED)
            }
                break;

            case "korisnik":
                const korisnik = await this.korisnikService.jedanKorisnik(jwtData.id)
            if (!korisnik) {
                throw new HttpException('Nije pronađen koisnik', HttpStatus.UNAUTHORIZED)
            }
            break;
        }
        
        const trenutnoVreme = new Date().getTime() / 1000
        if (trenutnoVreme >= jwtData.exp) {
            throw new HttpException('Token je istekao', HttpStatus.UNAUTHORIZED)
        }

        req.token = jwtData;

        next();
    }
}