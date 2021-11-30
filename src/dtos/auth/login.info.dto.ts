export class LoginInfoDto {
    id: number;
    identity: string;
    token: string;
    refreshToken: string;
    refershTokenExpiresAt: string;

    constructor(id: number, identity: string, token: string, refreshToken: string, refershTokenExpiresAt: string) {
        this.id = id;
        this.identity = identity;
        this.token = token;
        this.refreshToken = refreshToken;
        this.refershTokenExpiresAt = refershTokenExpiresAt
    }
}