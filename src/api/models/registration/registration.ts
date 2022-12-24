import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import axios from "axios";
import { VehicleMetadata } from "../vehicleMetadata/vehicleMetadata";

interface vehicleDataPackage {
  maker: string | null;
  manufacturer: string | null;
  model: string | null;
  modelYear: number | null;
  numberOfDoors: number | null;
  numberOfSeats: number | null;
  transmissionStyle: string | null;
}
const translationResultToPackage = {
  Make: {
    interfacePropertyName: "maker",
  },
  "Manufacturer Name": {
    interfacePropertyName: "manufacturer",
  },
  Model: {
    interfacePropertyName: "model",
  },
  "Model Year": {
    interfacePropertyName: "modelYear",
    transformType: "number",
  },
  Doors: {
    interfacePropertyName: "numberOfDoors",
    transformType: "number",
  },
  "Number of Seats": {
    interfacePropertyName: "numberOfSeats",
    transformType: "number",
  },
  "Transmission Style": {
    interfacePropertyName: "transmissionStyle",
  },
};

@Entity("Registrations")
export class Registration extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  number: number;

  @Column({
    length: 3,
  })
  state: string;

  @Column({
    length: 2,
    default: "US",
  })
  country: string;

  @Column({
    length: 100,
  })
  fullname: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  decodeVin(validVin: string): Promise<vehicleDataPackage | null> {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${validVin}`, {
          params: {
            format: "json",
          },
        })
        .then((result) => {
          const data = result.data;
          let vehicleData: vehicleDataPackage = new VehicleMetadata();
          data.Results.forEach((resultObject) => {
            let translatedPayload = translationResultToPackage[resultObject.Variable];
            if (translatedPayload !== undefined) {
              if (translatedPayload.transformType === undefined) {
                vehicleData[translatedPayload.interfacePropertyName] = resultObject.Value;
              } else {
                // TODO refactor here if different changes using a factory design pattern
                vehicleData[translatedPayload.interfacePropertyName] = Number(resultObject.Value);
              }
            }
          });
          resolve(vehicleData);
        })
        .catch((error) => {
          if (error !== undefined) {
            console.log(error);
            const response = error.response;
            console.debug(`ERROR DECODING VIN HTTP CODE -> [${response?.status}]`);
            console.debug(`Payload: ${response.data}`);
            reject(null);
          }
        });
    });
  }
}
