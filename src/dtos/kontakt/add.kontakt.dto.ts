import * as Validator from "class-validator";

export class AddKontaktDto {
    @Validator.IsNotEmpty()
    @Validator.IsEmail({
        allow_ip_domain: false,
        allow_utf8_local_part: true,
        require_tld: true,
  })
  email: string;

    prezime: string;
    ime: string;
    adresa: string;
    mesto: string;
    datumRodjenja: string;
    korisnikId: number;
    telefoni:  {
        kontaktId: number,
        brojTelefona: string,
        napomenaTelefon: string,
    }[]
}