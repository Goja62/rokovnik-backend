import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddKontaktDto } from "src/dtos/kontakt/add.kontakt.dto";
import { EditKontaktDto } from "src/dtos/kontakt/edit.kontakt.dto";
import { Kontakt } from "src/entities/kontakt";
import { Telefon } from "src/entities/telefon";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

@Injectable()
export class KontaktService {
    constructor(
        @InjectRepository(Kontakt) private readonly kontakt: Repository<Kontakt>,
        @InjectRepository(Telefon) private readonly telefon: Repository<Telefon>, 
    ) { }

    async sviKontakti(): Promise<Kontakt[]> {
        return await this.kontakt.find({
            relations: [
                "telefoni",
                "fotografija"
            ]
        })
    }

    async jedanKontakt(kontaktId: number): Promise<Kontakt | ApiResponse> {
        const kontakt = await this.kontakt.findOne(kontaktId, {
            relations: [
                "telefoni"
            ]
        })

        if (!kontakt) {
            return new ApiResponse('Greška', -2001, "Nije pronađen kontakt")
        }

        return await kontakt;
    }

    async addKontakt(data: AddKontaktDto): Promise<Kontakt | ApiResponse> {
        let noviKontakt: Kontakt = new Kontakt()
        noviKontakt.email = data.email;
        noviKontakt.prezime = data.prezime;
        noviKontakt.ime = data.ime;
        noviKontakt.adresa = data.adresa;
        noviKontakt.mesto = data.mesto;
        noviKontakt.datumRodjenja = data.datumRodjenja
        noviKontakt.korisnikId = data.korisnikId
       
        const sacuvaniKontakt = await this.kontakt.save(noviKontakt)

        for (const telefon of data.telefoni) {
            let noviTelefon: Telefon = new Telefon()
            noviTelefon.kontaktId = sacuvaniKontakt.kontaktId,
            noviTelefon.brojTelefona = telefon.brojTelefona
            noviTelefon.napomenaTelefon = telefon.napomenaTelefon,

            await this.telefon.save(noviTelefon)
        }

        return await this.kontakt.findOne(sacuvaniKontakt.kontaktId, {
            relations: [
                "telefoni"
            ]
        })
    }

    async editKontak(kontaktId: number, data: EditKontaktDto): Promise<Kontakt | ApiResponse> {
        const kontakt: Kontakt = await this.kontakt.findOne(kontaktId, {
            relations: [ 'telefoni' ]
        })

        if(!kontakt) {
            return new ApiResponse('Greška', -2001, "Nije pronađen kontakt")
        }

        console.log(kontakt.email)
        if (kontakt.email === data.email) {
            return new ApiResponse('Greška', -2003, "Email " +  data.email + " već postoji u bazi podataka")
        }

        kontakt.email = data.email
        kontakt.prezime = data.prezime;
        kontakt.ime = data.ime;
        kontakt.adresa = data.adresa;
        kontakt.mesto = data.mesto;
        kontakt.datumRodjenja = data.datumRodjenja;
        kontakt.korisnikId = data.korisnikId;
        
        const sacuvaniKontakt = await this.kontakt.save(kontakt)

        if (!sacuvaniKontakt) {
            return new ApiResponse('Greška', -2002, "Kontakt ne može biti sačuvan")
        }

        if (data.telefoni !== null) {
            await this.telefon.remove(kontakt.telefoni)

            for (const telefon of data.telefoni) {
                let noviTelefon: Telefon = new Telefon()
                noviTelefon.kontaktId = telefon.kontaktId,
                noviTelefon.brojTelefona = telefon.brojTelefona
                noviTelefon.napomenaTelefon = telefon.napomenaTelefon,

                await this.telefon.save(noviTelefon)
            }
        }

        return await this.kontakt.findOne(kontaktId, {
            relations: [
                "telefoni"
            ]
        })
    }      
    

}

