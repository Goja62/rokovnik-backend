import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TelefonController } from "src/controllers/api/telefon.controller";
import { AddTelefonDto } from "src/dtos/telefon/add.telefon.dto";
import { EditTelefonDto } from "src/dtos/telefon/edit.telefon.dto";
import { Telefon } from "src/entities/telefon";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

@Injectable()
export class TelefonService {
    constructor(
        @InjectRepository(Telefon) private readonly telefon: Repository<Telefon>,
    ) {}

    async sviTelefoni(): Promise<Telefon[] | ApiResponse> {
        return await this.telefon.find()
    }

    async jedanTelefon(telefonId: number): Promise<Telefon> {
        return await this.telefon.findOne(telefonId, {
            relations: [
                'kontakt'
            ]
        })
       
    }

    async addTelefon(telefonId: number, data: AddTelefonDto): Promise<Telefon | ApiResponse> {
        const telefon = await this.telefon.findOne(telefonId, {
            relations: [ 'kontakt' ]
        })

        if (!telefon) {
            return new ApiResponse('Greška', -3001, "Nije pronađen nijedan telefon")
        }

        const postojeciTelefon = new Telefon()
        postojeciTelefon.kontaktId = data.kontaktId;
        postojeciTelefon.brojTelefona = data.brojTelefona;
        postojeciTelefon.napomenaTelefon = data.napomenaTelefon;

        const noviTelefon = await this.telefon.save(postojeciTelefon)

        return await this.telefon.findOne(noviTelefon, {
            relations: [ 'kontakt' ]
        })
    }

    async editTelefon(telefonId: number, data: EditTelefonDto): Promise<Telefon | ApiResponse> {
        const telefon: EditTelefonDto = await this.telefon.findOne(telefonId, {
            relations: [
                'kontakt'
            ]
        })

        console.log(telefon)

        telefon.kontaktId = data.kontaktId;
        telefon.brojTelefona = data.brojTelefona;
        telefon.napomenaTelefon = data.napomenaTelefon;

        const sacuvaniTelefon = await this.telefon.save(telefon)

        if (!sacuvaniTelefon) {
            return new ApiResponse('Greška', -3002, "Podaci se ne mogu promeniti")
        }

        return sacuvaniTelefon
    }

}