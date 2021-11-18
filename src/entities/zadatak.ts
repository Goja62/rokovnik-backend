import { text } from "stream/consumers";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Kontakt } from "./kontakt";

@Index("fk_zadatak_konatakt_id", ["kontaktId"], {})
@Entity("zadatak")
export class Zadatak {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "zadatak_id", 
    unsigned: true 
  })
  zadatakId: number;

  @Column({ 
    type: "int",
    name: "kontakt_id", 
    unsigned: true, 
  })
  kontaktId: number;

  @Column({ 
    type: "text",
    name: "opis_zdatka" 
  })
  opisZdatka: string;

  @ManyToOne(
    () => Kontakt, (kontakt) => kontakt.zadaci, { onDelete: "RESTRICT", onUpdate: "CASCADE", }
  )
  @JoinColumn(
    [{ name: "kontakt_id", referencedColumnName: "kontaktId" }]
  )
  kontakt: Kontakt;
}
