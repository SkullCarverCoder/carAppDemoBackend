import {
  BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("Registrations")
export class Registration extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  number: number;

  @Column({
    length: 3
  })
  state: string;

  @Column({
    length: 2,
    default: "US"
  })
  country: string;

  @Column({
    length: 100
  })
  fullname: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
