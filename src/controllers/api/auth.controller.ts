import { Body, Controller, Post, Req } from "@nestjs/common";
import { LoginAdministratorDto } from "src/dtos/auth/login.administrator.dto";
import { Administrator } from "src/entities/administrator";
import { ApiResponse } from "src/misc/api.response";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from "crypto"
import { LoginInfoAdministratorDto } from "src/dtos/administrator/login.info.administrator.dto";
import * as jwt from "jsonwebtoken"
import { JwtDataAdministartorDto } from "src/dtos/administrator/jwt.data.administrator.dto";
import { Funkcije } from "src/misc/funkcije";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
const funkcija = new Funkcije()


@Controller('auth')
export class AuthController {
    constructor(
        public administratorService: AdministratorService,
    ) {}

    @Post('login/administrator') // POST http://localhost:3000/auth/login/administrator
    async doLogin(@Body() data: LoginAdministratorDto, @Req() req: Request): Promise<LoginInfoAdministratorDto | ApiResponse> {
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

        const jwtData = new JwtDataAdministartorDto()
        jwtData.administratorId = administrator.administratorId;
        jwtData.username = administrator.username;
        jwtData.exp = funkcija.istekToena(60 * 60 * 24 * 14);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers['user-agent']

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret)

        const responseObject = new LoginInfoAdministratorDto(
            administrator.administratorId, 
            administrator.username, 
            token
        )

        return new Promise(resolve => { resolve(responseObject) })
    }
}
