import { Body, Injectable, Param, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Korisnik } from "src/entities/korisnik";
import { Repository, UsingJoinColumnIsNotAllowedError } from "typeorm";
import * as crypto from "crypto";
import { ApiResponse } from "src/misc/api.response";
import { EditKorisnikDto } from "src/dtos/korisnik/edit.korisnik.dto";
import { KorisnikRegistrationDto } from "src/dtos/korisnik/korisnik.registration.dto";
import { KorisnikToken } from "src/entities/korisnik-token";

@Injectable()
export class KorisnikService {
    constructor(
        @InjectRepository(Korisnik) private readonly korisnik: Repository<Korisnik>,
        @InjectRepository(KorisnikToken) private readonly korisnikToken: Repository<KorisnikToken>,
    ) { }

    async sviKorisnici(): Promise<Korisnik[]> {
        return await this.korisnik.find({
            relations: [
                "kontakti",
                "kontakti.telefoni"
            ]
        })
    }

    async jedanKorisnik(korisnikId: number): Promise<Korisnik | ApiResponse> {
        const korisnik = await this.korisnik.findOne(korisnikId) 

        if (!korisnik) {
            return new ApiResponse('Greška', -1003, 'Nije pronađen korisnik')
        }

        return korisnik
    }

    async getKorisnikByEmail(email: string): Promise<Korisnik | null> {
        const korisnik: Korisnik = await this.korisnik.findOne({
            email: email,
        })
 
        if (!korisnik) {
            return null
        }
 
        return korisnik
     }

    async addKorisnik(data: KorisnikRegistrationDto): Promise<Korisnik | ApiResponse> {
        const passwordHash = crypto.createHash('sha512')
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase()
        
        const newKorisnik = new Korisnik()
        newKorisnik.email = data.email;
        newKorisnik.passwordHash = passwordHashString;
        newKorisnik.prezime = data.prezime;
        newKorisnik.ime = data.ime;
        newKorisnik.telefon = data.telefon;
        newKorisnik.adresa = data.adresa;

        try {
            const savedKorisnik = await this.korisnik.save(newKorisnik);

            if (!savedKorisnik) {
                throw new Error('');
            }

            return savedKorisnik;
        } catch (e) {
            return new ApiResponse('Greška', -6001, 'Nalog je već kreiran.');
        }
    }

    async editKorisnik(korisnikId: number, data: EditKorisnikDto): Promise<Korisnik | ApiResponse> {
        let korisnik: Korisnik = await this.korisnik.findOne(korisnikId)
        console.log(korisnikId)
        if  (data.email === korisnik.email) {
            return new ApiResponse('Greška', -1002, 'U bazi već postoji email ' + data.email)
        }

        if  (data.telefon === korisnik.telefon) {
            return new ApiResponse('Greška', -1003, 'U bazi već postoji telefon ' + data.telefon)
        }
        
        const passwordHash = crypto.createHash('sha512')
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex')

        korisnik.email = data.email;
        korisnik.passwordHash = passwordHashString;
        korisnik.prezime = data.prezime;
        korisnik.ime = data.ime;
        korisnik.telefon = data.telefon;
        korisnik.adresa = data.adresa;

        return await this.korisnik.save(korisnik)
    }

    async addToken(korisnikId: number, token: string, expiresAt: string) {
        const korisnikToken = new KorisnikToken()
        korisnikToken.korisnikId = korisnikId;
        korisnikToken.token = token;
        korisnikToken.expiresAt = expiresAt;

        return await this.korisnikToken.save(korisnikToken)
    }

    async getKorisnikToken(korisnikToken: string): Promise<KorisnikToken> {
        return await this.korisnikToken.findOne({
            token: korisnikToken,
        })
    }

    async invalidateKorisnikToken(token: string): Promise<KorisnikToken | ApiResponse> {
        const korisnikTOken = await this.korisnikToken.findOne({
            token: token,
        })

        if (!this.korisnikToken) {
            return new ApiResponse('Greška', -7001, "Nije pronađen token")
        }

        korisnikTOken.isValid = 0

        await this.korisnikToken.save(korisnikTOken)

        return await this.getKorisnikToken(token)
    }

    async invalidateKorisnikTokeni(korisnikId: number): Promise<(KorisnikToken | ApiResponse)[]> {
        const korisnikTokeni = await this.korisnikToken.find({
            korisnikId: korisnikId
        })

        const rezultati = []

        for (const korisnikToken of korisnikTokeni) {
            rezultati.push(this.invalidateKorisnikToken(korisnikToken.token));
        }
        
        return rezultati;
    }
}