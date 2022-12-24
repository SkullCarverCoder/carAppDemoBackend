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
  AfterUpdate,
} from "typeorm";

import { Registration } from "../registration/registration";
import { VehicleMetadata } from "../vehicleMetadata/vehicleMetadata";
import * as _ from "lodash";

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

  @OneToOne(() => VehicleMetadata, {
    cascade: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  metadata: VehicleMetadata;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  @AfterUpdate()
  async getNewMetadata(): Promise<VehicleMetadata | void> {
    // event.entity; // returns updated properties in entity
    // this.car; // returns entity prior to update with all properties
    if (this.registration !== undefined && this.metadata !== undefined) {
      let newCarMetadata = await this.registration.decodeVin(this.vin);
      Object.keys(newCarMetadata).forEach((key) => {
        _.set(this.metadata, key, newCarMetadata[key]);
      });
      return this.metadata.save();
    }
  }
}
