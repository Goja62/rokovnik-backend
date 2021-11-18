import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Kontakt } from "./kontakt";

@Index("fk_dogadjaj_konatakt_id", ["kontaktId"], {})
@Entity("dogadjaj")
export class Dogadjaj {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "dogadjaj_id", 
    unsigned: true 
  })
  dogadjajId: number;

  @Column({ 
    type: "int",
    name: "kontakt_id", 
    unsigned: true,
  })
  kontaktId: number;

  @Column({ 
    type: "text",
    name: "opis_dogadjaja" 
  })
  opisDogadjaja: string;

  @ManyToOne(
    () => Kontakt, (kontakt) => kontakt.dogadjaji, { onDelete: "RESTRICT", onUpdate: "CASCADE", }
  )
  @JoinColumn(
    [{ name: "kontakt_id", referencedColumnName: "kontaktId" }]
  )
  kontakt: Kontakt;
}
