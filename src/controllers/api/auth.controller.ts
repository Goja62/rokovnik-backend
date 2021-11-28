import { Body, Controller, Post, Req } from "@nestjs/common";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { Administrator } from "src/entities/administrator";
import { ApiResponse } from "src/misc/api.response";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from "crypto"
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import * as jwt from "jsonwebtoken"
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Funkcije } from "src/misc/funkcije";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
import { LoginKorisnikDto } from "src/dtos/korisnik/login.korisnik.dto";
import { KorisnikService } from "src/services/korisnik/korisnik.service";
const funkcija = new Funkcije()


@Controller('auth')
export class AuthController {
    constructor(
        public administratorService: AdministratorService,
        public korisnikService: KorisnikService
    ) {}

    @Post('administrator/login') // POST http://localhost:3000/auth/login/administrator
    async doAdministratorLogin(@Body() data: LoginAdministratorDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const administrator = await this.administratorService.getAdministratorByUsername(data.username)

        if(!administrator) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška', -4001, 'Nije pronađen administrator sa korisničkim imenom ' + data.username))
            })
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password)
        const passwordHashString = passwordHash.digest('hex').toUpperCase()

        if (administrator.passwordHash !== passwordHashString) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška', -4002, 'Nije ispravna lozinka za administratora ' + data.username))
            })
        }
        const jwtData = new JwtDataDto()
        jwtData.role = "administrator"
        jwtData.id = administrator.administratorId;
        jwtData.identity = administrator.username;
        jwtData.exp = funkcija.istekToena(60 * 60 * 24 * 14);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers['user-agent']

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret)

        const responseObject = new LoginInfoDto(
            administrator.administratorId, 
            administrator.username, 
            token
        )

        return new Promise(resolve => { resolve(responseObject) })
    }

    @Post('korisnik/login') // POST http://localhost:3000/auth/login/administrator
    async doKorisnikLogin(@Body() data: LoginKorisnikDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const korisnik = await this.korisnikService.getKorisnikByEmail(data.email)

        if(!korisnik) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška', -4001, 'Nije pronađen korisnik sa emailom ' + data.email))
            })
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password)
        const passwordHashString = passwordHash.digest('hex').toUpperCase()
        

        if (korisnik.passwordHash !== passwordHashString) {
            return new Promise(resolve => {
                resolve(new ApiResponse('Greška', -4002, 'Nije ispravna lozinka za korisnika ' + data.email))
            })
        }

        const jwtData = new JwtDataDto()
        jwtData.role = "korisnik"
        jwtData.id = korisnik.korisnikId;
        jwtData.identity = korisnik.email;
        jwtData.exp = funkcija.istekToena(60 * 60 * 24 * 14);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers['user-agent']

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret)

        const responseObject = new LoginInfoDto(
            korisnik.korisnikId, 
            korisnik.email, 
            token
        )

        return new Promise(resolve => { resolve(responseObject) })
    }

    @Post('korisnik/register') // POST http://localhost:3000/auth/korisnik/register
    async korisnikRegister() {}
}
