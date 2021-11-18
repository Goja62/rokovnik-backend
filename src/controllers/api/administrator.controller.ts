import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { AddAdminisratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdminisratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { Administrator } from "src/entities/administrator";
import { AdministratorService } from "src/services/administrator.service";

@Controller('api/administrator')
export class AdministratorController {
    constructor(private administratorService: AdministratorService) {}

    @Get() //GET http://localhost:3000/api/administrator
    async sviAdministratori(): Promise<Administrator[]> {
        return await this.administratorService.sviAdministratori()
    }

    @Get(':id')
    async jedanAdministrator(@Param('id') id: number): Promise<Administrator> {
        return await this.administratorService.jedanAdministrator(id)
    }

    @Post() //POST http://localhost:3000/api/administrator
    async addAdministrator(@Body() data: AddAdminisratorDto) {
        return await this.administratorService.addAdministrator(data)
    }

    @Patch(':id')
    async editAdministrator(@Param('id') administratorId: number, @Body() data: EditAdminisratorDto): Promise<Administrator> {
        return await this.administratorService.editAdministrator(administratorId, data)
    }
}