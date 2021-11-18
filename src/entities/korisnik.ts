import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, } from "typeorm";
import { Kontakt } from "./kontakt";
import { KorisnikToken } from "./korisnik-token";

@Index("uq_korisnik_telefon", ["telefon"], { unique: true })
@Index("uq_korisnik_email", ["email"], { unique: true })
@Entity("korisnik")
export class Korisnik {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "korisnik_id", 
    unsigned: true 
  })
  korisnikId: number;

  @Column({
    type: "varchar",
    unique: true,
    length: 50,
  })
  email: string;

  @Column({
    type: "varchar",
    name: "password_hash",
    length: 128,
  })
  passwordHash: string;

  @Column({ 
    type: "varchar",
    length: 50 
  })
  prezime: string;

  @Column({ 
    type: "varchar",
    length: 50 
  })
  ime: string;

  @Column({ 
    type: "varchar",
    unique: true, 
    length: 50 
  })
  telefon: string;

  @Column({ 
    type: "varchar",
    nullable: true, 
    length: 50 
  })
  adresa: string | null;

  @OneToMany(() => Kontakt, (kontakt) => kontakt.korisnik)
  kontakti: Kontakt[];

  @OneToMany(() => KorisnikToken, (korisnikToken) => korisnikToken.korisnik)
  korisnikTokeni: KorisnikToken[];
}
