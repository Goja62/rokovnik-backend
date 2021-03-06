import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
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
import { JwtRefreshDataDto } from "src/dtos/auth/jwt.refresh.data.dto";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { KorisnikRefreshTokenDto } from "src/dtos/auth/korisnik.refresh.token.dto";
import { KorisnikToken } from "src/entities/korisnik-token";
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
        jwtData.exp = funkcija.istekToena(60 *5);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers['user-agent']

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret)

        const responseObject = new LoginInfoDto(
            administrator.administratorId, 
            administrator.username, 
            token,
            '',
            '',
        )

        return new Promise(resolve => { resolve(responseObject) })
    }

    @Post('/login/korisnik') // POST http://localhost:3000/auth/korisnik/login
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
        jwtData.exp = funkcija.istekToena(60 * 5);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers['user-agent']

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret)

        const jwtRefreshData = new JwtRefreshDataDto()
        jwtRefreshData.role = "korisnik";
        jwtRefreshData.id = jwtData.id;
        jwtRefreshData.identity = jwtData.identity;
        jwtRefreshData.exp = funkcija.istekToena(60 * 60 * 24 * 31);
        jwtRefreshData.ip = jwtData.ip;
        jwtRefreshData.ua = jwtData.ua;

        let refreshToken: string = jwt.sign(jwtRefreshData.toPlainObject(), jwtSecret)



        const responseObject = new LoginInfoDto(
            korisnik.korisnikId, 
            korisnik.email, 
            token,
            refreshToken,
            funkcija.getIsoDate(jwtRefreshData.exp),
        )

        await this.korisnikService.addToken(korisnik.korisnikId, refreshToken, funkcija.getDatabseDateFormat(funkcija.getIsoDate(jwtRefreshData.exp)))

        return new Promise(resolve => { resolve(responseObject) })
    }

    @Post('refresh/korisnik') // POST http://localhost:3000/auth/korisnik/refresh
    async korisnikTokenRefresh(@Req() req: Request, @Body() data: KorisnikRefreshTokenDto): Promise<LoginInfoDto | ApiResponse> {
        const korisnikToken = await this.korisnikService.getKorisnikToken(data.token)

        if (!korisnikToken) {
            return new ApiResponse("Greška", -8001, "Nije pronađen refresh token")
        }

        if (korisnikToken.isValid === 0) {
            return new ApiResponse("Greška", -8002, "Token više nije validan")
        }

        const trenutniDatum = new Date()
        const datumIsteka = new Date(korisnikToken.expiresAt)

        if (datumIsteka.getTime() < trenutniDatum.getTime()) {
            return new ApiResponse("Greška", -8003, "Token je sitekao")
        }

        let jwtRefreshData: JwtRefreshDataDto;

        try {
            jwtRefreshData = jwt.verify(data.token, jwtSecret)
        } catch (e) {
            throw new HttpException('Token nije pronađen', HttpStatus.UNAUTHORIZED)
        }

        if (!jwtRefreshData) {
            throw new HttpException('Pogrešan token', HttpStatus.UNAUTHORIZED)
        }

        if (jwtRefreshData.ip !== req.ip.toString()) {
            throw new HttpException('Netačna IP adresa', HttpStatus.UNAUTHORIZED)
        }

        if (jwtRefreshData.ua !== req.headers['user-agent']) {
            throw new HttpException('Netačne informacije i user-agentu', HttpStatus.UNAUTHORIZED)
        }


        const jwtData = new JwtDataDto()
        jwtData.role = jwtRefreshData.role;
        jwtData.id = jwtRefreshData.id
        jwtData.identity = jwtRefreshData.identity;
        jwtData.exp = funkcija.istekToena(60 * 5);
        jwtData.ip = jwtRefreshData.ip;;
        jwtData.ua = jwtRefreshData.ua;

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret)

        const responseObject = new LoginInfoDto(
            jwtData.id, 
            jwtData.identity, 
            token,
            data.token,
            funkcija.getIsoDate(jwtRefreshData.exp),
        )

        return responseObject;
    }

    @Post('korisnik/register') // POST http://localhost:3000/auth/korisnik/register
    async korisnikRegister() {}
}
