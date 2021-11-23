import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { AddTelefonDto } from "src/dtos/telefon/add.telefon.dto";
import { EditTelefonDto } from "src/dtos/telefon/edit.telefon.dto";
import { Telefon } from "src/entities/telefon";
import { ApiResponse } from "src/misc/api.response";
import { TelefonService } from "src/services/telefon/telefon.service";

@Controller('api/telefon')
export class TelefonController {
    constructor(private telefonService: TelefonService) {}

    @Get() // GET http://localhost:3000/api/telefon/14
    async sviTelefoni(): Promise <Telefon[] | ApiResponse> {
        return await this.telefonService.sviTelefoni()
    }

    @Get('/:id') //GET http://localhost:3000/api/telefon/:id
    async getByKorisnikId(@Param('id') id: number): Promise<Telefon> {
        return await this.telefonService.jedanTelefon(id)
    }

    @Post('/add') // POST http://localhost:3000/api/telefon/add
    async addTelefon(@Param() telefonId: number, @Body() data: AddTelefonDto): Promise<Telefon | ApiResponse> {
        return await this.telefonService.addTelefon(telefonId, data)
    }

    @Patch('edit/:id') // PATCH http://localhost:3000/api/telefon/edit/:id
    async editTelefon(@Param('id') telefonId: number, @Body() data: EditTelefonDto) {
        return await this.telefonService.editTelefon(telefonId, data)
    }
}