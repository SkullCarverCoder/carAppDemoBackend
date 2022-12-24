import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("VehicleMetadata")
export class VehicleMetadata extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 50,
    nullable: true,
  })
  maker: string;

  @Column({
    length: 100,
    nullable: true,
  })
  manufacturer: string;

  @Column({
    length: 120,
    nullable: true,
  })
  model: string;

  @Column({
    nullable: true,
  })
  modelYear: number;

  @Column({
    nullable: true,
  })
  numberOfDoors: number;

  @Column({
    nullable: true,
  })
  numberOfSeats: number;

  @Column({
    nullable: true,
  })
  transmissionStyle: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
