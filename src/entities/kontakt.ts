import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Beleska } from "./beleska";
import { Dogadjaj } from "./dogadjaj";
import { Fotografija } from "./fotografija";
import { Korisnik } from "./korisnik";
import { Telefon } from "./telefon";
import { Zadatak } from "./zadatak";
import * as Validator from "class-validator";
import { Allow } from "class-validator";

@Index("uq_email", ["email"], { unique: true })
@Index("fk_korisnik_kontakt_id", ["korisnikId"], {})
@Entity("kontakt")
export class Kontakt {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "kontakt_id", 
    unsigned: true
 })
  kontaktId: number;

  @Column({
    type: "varchar",
    unique: true,
    length: 50,
  })
  @Validator.IsNotEmpty()
  @Validator.IsEmail({
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    require_tld: true,
  })
  email: string;

  @Column({ 
    type: "varchar",
    length: 50,
  })
  prezime: string;

  @Column({ 
    type: "varchar",
    length: 50,
  })
  ime: string;

  @Column({
    type: "varchar",
    nullable: true,
    length: 128,
  })
  adresa: string | null;

  @Column({
    type: "varchar",
    nullable: true,
    length: 128,
  })
  mesto: string | null;

  @Column({ 
    type: "datetime",
    name: "datum_rodjenja", 
    nullable: true 
  })
  datumRodjenja: string | null;

  @Column({ 
    type: "int",
    name: "korisnik_id", 
    unsigned: true, 
  })
  korisnikId: number;

  @OneToMany(() => Beleska, (beleska) => beleska.kontakt)
  beleske: Beleska[];

  @OneToMany(() => Dogadjaj, (dogadjaj) => dogadjaj.kontakt)
  dogadjaji: Dogadjaj[];

  @OneToOne(() => Fotografija, (fotografija) => fotografija.kontakt)
  fotografija: Fotografija;

  @ManyToOne(
    () => Korisnik, (korisnik) => korisnik.kontakti, { onDelete: "RESTRICT", onUpdate: "CASCADE", }
  )
  @JoinColumn(
    [{ name: "korisnik_id", referencedColumnName: "korisnikId" }]
  )
  korisnik: Korisnik;

  @OneToMany(() => Telefon, (telefon) => telefon.kontakt)
  telefoni: Telefon[];

  @OneToMany(() => Zadatak, (zadatak) => zadatak.kontakt)
  zadaci: Zadatak[];
}
