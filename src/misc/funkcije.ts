
import { StorageConfig } from "config/storage.config";
import * as sharp from "sharp";
import { Kontakt } from "src/entities/kontakt";

export class Funkcije {
    public istekToena(milisekunde: number) {
        return new Date().getTime() / 1000 + milisekunde
    }

    public getIsoDate(timestamp: number) {
        const datum = new Date()
        datum.setTime(timestamp * 1000)
        return datum.toISOString()
    }

    public getDatabseDateFormat(isoFormat: string): string {
        return isoFormat.substr(0, 19).replace('T', ' ');
    }
    
    public async createResizedImage(photo, resizeSetings) {
        const orignalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.slika.destinacija  + resizeSetings.directory + fileName

        sharp(orignalFilePath)
            .resize({
                fit: 'cover',
                width: resizeSetings.width,
                height: resizeSetings.height
            })
            .toFile(destinationFilePath)
    }

    public makeKontakt(kontakt: Kontakt): string {
        return `<p><b>Podaci o kontaktu</b></p>
                <p>Detalji:</p>
                <ul>
                   <li> ${ kontakt.email } </li>
                   <li> ${ kontakt.prezime } </li>
                   <li> ${ kontakt.ime } </li>
                   <li> ${ kontakt.adresa } </li>;
                   <li> ${ kontakt.mesto } </li>;
                    ${ kontakt.telefoni.map((telefon) => {
                        return `<li>${telefon.brojTelefona}</li>)`
                    }).join("")}
                </ul>`;
    }
}