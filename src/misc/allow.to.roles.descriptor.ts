import { SetMetadata } from "@nestjs/common"

export const AllowToRoles = (...roles: ("administrator" | "korisnik")[]) => {
    return SetMetadata('allow_to_roles', roles);
    
}