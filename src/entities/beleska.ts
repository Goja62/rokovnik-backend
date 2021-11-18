import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Kontakt } from "./kontakt";

@Index("fk_beleska_kontakt_id", ["kontaktId"], {})
@Entity("beleska", { schema: "rokovnik" })
export class Beleska {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "beleska_id", 
    unsigned: true 
  })
  beleskaId: number;

  @Column({ 
    type: "int",
    name: "kontakt_id", 
    unsigned: true,
  })
  kontaktId: number;

  @Column({ 
    type: "text",
    name: "opis_beleske" 
  })
  opisBeleske: string;

  @ManyToOne(
    () => Kontakt, (kontakt) => kontakt.beleske, { onDelete: "RESTRICT", onUpdate: "CASCADE", }
  )
  @JoinColumn(
    [{ name: "kontakt_id", referencedColumnName: "kontaktId" }]
  )
  kontakt: Kontakt;
}
