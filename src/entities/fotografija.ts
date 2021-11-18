import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Kontakt } from "./kontakt";

@Index("uq_fotografija_kontakt_id", ["kontaktId"], { unique: true })
@Index("fk_fotografija_konatakt_id", ["kontaktId"], {})
@Entity("fotografija")
export class Fotografija {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "fotografija_id",
    unsigned: true,
  })
  fotografijaId: number;

  @Column({
    type: "int",
    name: "kontakt_id",
    unique: true,
    unsigned: true,
  })
  kontaktId: number;

  @Column({
    type: "varchar",
    length: 50,
  })
  putanja: string;

  @OneToOne(
    () => Kontakt, (kontakt) => kontakt.fotografija, { onDelete: "RESTRICT", onUpdate: "CASCADE", }
  )
  @JoinColumn(
    [{ name: "kontakt_id", referencedColumnName: "kontaktId" }]
  )
  kontakt: Kontakt;
}
