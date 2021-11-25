import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from "jsonwebtoken"
import { JwtDataAdministartorDto } from "src/dtos/administrator/jwt.data.administrator.dto";
import { jwtSecret } from "config/jwt.secret";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(public readonly administratorService: AdministratorService) {}

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

        let jwtData: JwtDataAdministartorDto;

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

        const administrator = await this.administratorService.jedanAdministrator(jwtData.administratorId)
        if (!administrator) {
            throw new HttpException('Nije pronađen administrator', HttpStatus.UNAUTHORIZED)
        }
        
        const trenutnoVreme = new Date().getTime() / 1000
        if (trenutnoVreme >= jwtData.exp) {
            throw new HttpException('Token je istekao', HttpStatus.UNAUTHORIZED)
        }

        next();
    }
}