import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class RoleCheckerGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: Request = context.switchToHttp().getRequest()
        const role = req.token.role;

        const allowedToRoles = this.reflector.get<("administrator" | "korisnik")[]>('allow_to_roles', context.getHandler());

        if (!allowedToRoles.includes(role)) {
            throw new HttpException('Nije vam dozvoljeno da pristupite ovoj stranici', HttpStatus.UNAUTHORIZED)
        }

        return true

    }

}