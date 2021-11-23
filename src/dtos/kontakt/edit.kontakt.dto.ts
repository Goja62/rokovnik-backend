export class EditKontaktDto {
    email: string;
    prezime: string;
    ime: string;
    adresa: string;
    mesto: string;
    datumRodjenja: string;
    korisnikId: number
    telefoni:  {
        kontaktId: number,
        brojTelefona: string,
        napomenaTelefon: string,
    }[]
}