import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Registration } from "../registration/registration";

@Entity("Cars")
export class Car extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    default: true,
  })
  active: boolean;

  @Column({
    length: 12,
  })
  licensePlate: string;

  @Column({
    length: 17,
    unique: true,
  })
  vin: string;

  @Column({
    length: 320,
  })
  description: string;

  @Column("double")
  value: number;

  @Column()
  currentMileage: number;

  // Hex string #FFFFFF for white
  @Column()
  color: string;

  @OneToOne(() => Registration, {
    cascade: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  registration: Registration;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
