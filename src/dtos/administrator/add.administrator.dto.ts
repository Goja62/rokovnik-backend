
import * as Validator from "class-validator";

export class AddAdminisratorDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Matches(/^[a-z][a-z0-9\.]{1,50}[a-z0-9]$/)
    username: string;

    @Validator.IsNotEmpty()
    @Validator.Length(6, 50)
    password: string;
}