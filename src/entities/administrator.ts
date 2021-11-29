import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import * as Validator from "class-validator";

@Index("uq_administrator_username", ["username"], { unique: true })
@Entity("administrator")
export class Administrator {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "administrator_id",
    unsigned: true,
  })
  administratorId: number;

  @Column({
    type: "varchar",
    unique: true,
    length: 50,
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9\.]{2,50}$[a-z0-9]/)
  username: string;

  @Column({
    type: "varchar",
    name: "password_hash",
    length: 128,
  })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;
}
