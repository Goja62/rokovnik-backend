import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Korisnik } from "./korisnik";
import * as Validator from "class-validator";

@Index("FK_korisnik_token_korisnik", ["korisnikId"], {})
@Entity("korisnik_token")
export class KorisnikToken {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "korisnik_token_id",
    unsigned: true,
  })
  korisnikTokenId: number;

  @Column({ 
    type: "int",
    name: "korisnik_id", 
    unsigned: true 
  })
  korisnikId: number;

  @Column({
    type: "timestamp",
    name: "created_at",
  })
  createdAt: string;

  @Column({ 
    type: "text" 
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  token: string;

  @Column({ 
    type: "datetime",
    name: "expires_at" 
  })
  expiresAt: string;

  @Column({ 
    type: "tinyint",
    name: "is_valid", 
    unsigned: true,
  })
  @Validator.IsNotEmpty()
  @Validator.IsIn([ 0, 1 ])
  isValid: number;

  @ManyToOne(
    () => Korisnik, (korisnik) => korisnik.korisnikTokeni, { onDelete: "RESTRICT", onUpdate: "CASCADE", }
  )
  @JoinColumn(
    [{ name: "korisnik_id", referencedColumnName: "korisnikId" }]
  )
  korisnik: Korisnik;
}
