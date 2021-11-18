import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mesto")
export class Mesto {
  @PrimaryGeneratedColumn({ 
    type: "int", 
    name: "mesto_id", 
    unsigned: true 
  })
  mestoId: number;

  @Column({ 
    type: "varchar",
    name: "naziv_mesta", 
    length: 255 
  })
  nazivMesta: string;
}
