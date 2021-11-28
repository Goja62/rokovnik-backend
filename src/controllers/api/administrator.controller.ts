import { Body, Controller, Get, Param, Patch, Post, SetMetadata, UseGuards } from "@nestjs/common";
import { AddAdminisratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdminisratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { Administrator } from "src/entities/administrator";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AdministratorService } from "src/services/administrator/administrator.service";

@Controller('api/administrator')
export class AdministratorController {
    constructor(private administratorService: AdministratorService) {}

    @Get() //GET http://localhost:3000/api/administrator
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    async sviAdministratori(): Promise<Administrator[]> {
        return await this.administratorService.sviAdministratori()
    }

    @Get(':id')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    async jedanAdministrator(@Param('id') id: number): Promise<Administrator> {
        return await this.administratorService.jedanAdministrator(id)
    }

    @Post() //POST http://localhost:3000/api/administrator
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    async addAdministrator(@Body() data: AddAdminisratorDto) {
        return await this.administratorService.addAdministrator(data)
    }

    @Patch(':id')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    async editAdministrator(@Param('id') administratorId: number, @Body() data: EditAdminisratorDto): Promise<Administrator> {
        return await this.administratorService.editAdministrator(administratorId, data)
    }
}