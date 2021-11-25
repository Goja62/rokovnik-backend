import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageConfig } from "config/storage.config";
import { diskStorage } from "multer";
import { AddKontaktDto } from "src/dtos/kontakt/add.kontakt.dto";
import { EditKontaktDto } from "src/dtos/kontakt/edit.kontakt.dto";
import { Fotografija } from "src/entities/fotografija";
import { Kontakt } from "src/entities/kontakt";
import { ApiResponse } from "src/misc/api.response";
import { KontaktService } from "src/services/kontakt/kontakt.service";
import { SlikaService } from "src/services/slika/slika.service";
import * as fs from 'fs';
import * as fileType from "file-type"
import { Funkcije } from "src/misc/funkcije";
let funkcija = new Funkcije()

@Controller('api/kontakt')
export class KontaktController {
    constructor(
        private kontaktService: KontaktService,
        private slikaService: SlikaService,
    ) {  }

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

    @Get('/:id/fotografija') // GET http://localhost:3000/api/kontakt/:id/
    async findOnePhoto(@Param('id') kontaktId: number): Promise<Fotografija | ApiResponse> {
        const fotografija = await this.slikaService.findOnePhoto(kontaktId)

       

        return fotografija
    }

    @Post(':id/uploadPhoto') // POST http://localhost:3000/api/kontakt/:id/uploadPhoto
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.slika.destinacija,
                filename: (req, file, callback) =>  {
                    let original: string = file.originalname;

                    let normalized = original.replace(/\s+/g, '-');
                    normalized = normalized.replace(/[^A-z0-9\.\-]/g, '');
                    let sada = new Date();
                    let datePart = '';
                    datePart += sada.getFullYear().toString();
                    datePart += (sada.getMonth() + 1).toString();
                    datePart += sada.getDate().toString();

                    let randomPart: string = 
                    new Array(10)
                    .fill(0)
                    .map(e => (Math.random() * 9).toFixed(0).toString())
                    .join('')

                    let fileName = datePart + '-' + randomPart + '-' + normalized
                    fileName = fileName.toLocaleLowerCase();

                    callback(null, fileName)
                }
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.toLowerCase().match(/\.(jpg|png)$/)) {
                    req.fileFiltetError = "Pogrešna ekstenzija dokumenta";
                    callback(null, false)
                    return;
                }

                if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
                    req.fileFiltetError = "Pogrešan top dokumenta";
                    callback(null, false)
                    return;
                }

                callback(null, true)
            },
            limits: {
                files: 1,
                fileSize: StorageConfig.slika.maxSize,
            }
        })
    )
    async uploadPhoto(@Param('id') kontaktId: number, @UploadedFile() photo, @Req() req): Promise<Fotografija | ApiResponse | Kontakt> {
        const postojeciKontakt = await this.findOnePhoto(kontaktId)

        if (postojeciKontakt !== undefined || postojeciKontakt === null) {
            fs.unlinkSync(photo.path)
            return new ApiResponse("Greška", -5002, 'Slika već postoji u bazi')
        }
        
        if (req.fileFiltetError) {
            return new ApiResponse("Greška", -5003, req.fileFiltetError)
        }

        if (!photo) {
            return new ApiResponse('Greška', -5001, "Fotografija ne može biti sačuvana")
        }

        const fileTypeResult = fileType.fromFile(photo.path);
        if (!fileTypeResult) {
            fs.unlinkSync(photo.path)
            return new ApiResponse('Greška', -5004, "Ne može se utvrdite tip dokumenta")
        }

        const realMimeType = (await fileTypeResult).mime

        if (!(realMimeType.includes('jpeg') || realMimeType.includes('png'))) {
            fs.unlinkSync(photo.path)
            return new ApiResponse('Greška', -5004, "Pogrešan tip dokumenta")
        } 

        await funkcija.createResizedImage(photo, StorageConfig.slika.resize.thumb)
        await funkcija.createResizedImage(photo, StorageConfig.slika.resize.small)

        const newSlika: Fotografija = new Fotografija()
        newSlika.kontaktId = kontaktId;
        newSlika.putanja = photo.filename

        const sacuvanaSlika = await this.slikaService.addSlika(newSlika)

        if (!sacuvanaSlika) {
            return new ApiResponse('Greška', -5004, "Fotografija ne može biti sačuvana")
        }
       
        return sacuvanaSlika;
    }

    @Delete(':kontaktId/deleteSlika/:slikaId') // DELETE http://localhost:3000/api/kontakt/:kontaktId/delete/:slikaId
    async deleteSlika(@Param('kontaktId') kontaktId: number, @Param('slikaId') slikaId: number) {
        const slika = await this.slikaService.findOne({
            kontaktId: kontaktId,
            fotografijaId: slikaId
        })

        if (!slika) {
            return new ApiResponse('Greška', -5005, "Nije pronađena nijedna slika")
        }

        try {
            fs.unlinkSync(StorageConfig.slika.destinacija + slika.putanja);
            fs.unlinkSync(StorageConfig.slika.destinacija + StorageConfig.slika.resize.small.directory + slika.putanja)
            fs.unlinkSync(StorageConfig.slika.destinacija + StorageConfig.slika.resize.thumb.directory + slika.putanja)
        } catch (e) { }
        

        const obrisanaSlika = await this.slikaService.brisanjeSlike(slika.fotografijaId) 

        if (obrisanaSlika.affected === 0) {
            return new ApiResponse('Greška', -5005, "Nije pronađena nijedna slika")
        }

        return new ApiResponse('OK', 0, 'Obrisana je jedna fotografija')
    }
}   