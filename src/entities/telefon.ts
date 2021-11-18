import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Kontakt } from "./kontakt";

@Index("uq_telefon_broj_telefona", ["brojTelefona"], { unique: true })
@Index("fk_telefon_konatakt_id", ["kontaktId"], {})
@Entity("telefon")
export class Telefon {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "telefon_id", 
    unsigned: true 
  })
  telefonId: number;

  @Column({ 
    type: "int",
    name: "kontakt_id", 
    unsigned: true,
  })
  kontaktId: number;

  @Column({
    type: "varchar",
    name: "broj_telefona",
    unique: true,
    length: 50,
  })
  brojTelefona: string;

  @Column({ 
    type: "varchar",
    name: "napomena_telefon", 
    length: 128 
  })
  napomenaTelefon: string;

  @ManyToOne(
    () => Kontakt, (kontakt) => kontakt.telefoni, { onDelete: "RESTRICT", onUpdate: "CASCADE", }
  )
  @JoinColumn(
    [{ name: "kontakt_id", referencedColumnName: "kontaktId" }]
  )
  kontakt: Kontakt;
}
