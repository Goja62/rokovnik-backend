export class LoginInfoDto {
    id: number;
    identity: string;
    token: string;

    constructor(administratorId: number, identity: string, token: string) {
        this.id = this.id;
        this.identity = identity;
        this.token = token;
    }
}