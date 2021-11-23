import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { AddKontaktDto } from "src/dtos/kontakt/add.kontakt.dto";
import { EditKontaktDto } from "src/dtos/kontakt/edit.kontakt.dto";
import { Kontakt } from "src/entities/kontakt";
import { ApiResponse } from "src/misc/api.response";
import { KontaktService } from "src/services/kontakt/kontakt.service";

@Controller('api/kontakt')
export class KontaktController {
    constructor(private kontaktService: KontaktService) {  }

    @Get()
    async sviKontakti(): Promise<Kontakt[]> {
       return await this.kontaktService.sviKontakti()
    }

    @Get(':id')
    async jedanKontakt(@Param('id') kontaktId: number) {
        return await this.kontaktService.jedanKontakt(kontaktId)
    }

    @Post('add')
    async addKontakt(@Body() data: AddKontaktDto): Promise<Kontakt> {
        return await this.kontaktService.addKontakt(data)
    }

    @Patch('edit/:id')
    async editKontakt(@Param('id') kontaktId: number, @Body() data: EditKontaktDto): Promise<Kontakt | ApiResponse> {
        return await this.kontaktService.editKontak(kontaktId, data)
    }
}