import * as Validator from "class-validator";

export class KorisnikRefreshTokenDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    token: string
}