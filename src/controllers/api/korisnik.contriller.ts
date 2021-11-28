import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { EditKorisnikDto } from "src/dtos/korisnik/edit.korisnik.dto";
import { Korisnik } from "src/entities/korisnik";
import { ApiResponse } from "src/misc/api.response";
import { KorisnikService } from "src/services/korisnik/korisnik.service";
import { diskStorage } from "multer"
import { StorageConfig } from "config/storage.config";
import { SlikaService } from "src/services/slika/slika.service";
import { Fotografija } from "src/entities/fotografija";
import { Kontakt } from "src/entities/kontakt";
import { KorisnikRegistrationDto } from "src/dtos/korisnik/korisnik.registration.dto";

@Controller('api/korisnik')
export class KorisnikController {
    constructor(
        private korisnikService: KorisnikService,
    ) { }

    @Get() //Get http://localhost:3000/api/korisnik
    async sviKorisnici(): Promise<Korisnik[]> {
        return await this.korisnikService.sviKorisnici()
    }

    @Get(':id') //Get http://localhost:3000/api/korisnik:id
    async jedanKorisnik(@Param('id') korisnikId: number): Promise<Korisnik | ApiResponse> {
        return await this.korisnikService.jedanKorisnik(korisnikId)
    }
    
    @Post('add') // POST http://localhost:3000/api/korisnik/add
    async addKorisnik(@Body() data: KorisnikRegistrationDto): Promise<Korisnik | ApiResponse> {
        return await this.korisnikService.addKorisnik(data)
    }

    @Patch('edit/:id')
    async editKorisnik(@Param('id') korisnikId: number, @Body() data: EditKorisnikDto): Promise<Korisnik | ApiResponse> {
        return await this.korisnikService.editKorisnik(korisnikId, data)
    }
}