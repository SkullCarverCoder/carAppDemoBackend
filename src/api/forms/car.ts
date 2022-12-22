import {
  IsAlphanumeric,
  IsDateString,
  Max,
  Min,
  IsHexColor,
  IsCurrency,
  ValidateNested,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
} from "class-validator";
import { RegistrationForm } from "./registration";

export class UpdateCarForm {
  @IsAlphanumeric()
  @Max(12)
  licensePlate: string;

  @IsAlphanumeric()
  @Min(11)
  @Max(17)
  vin: string;

  @IsAlphanumeric()
  @Max(320)
  description: string;

  // e.g 20,000$
  @IsCurrency({ thousands_separator: "," })
  value: string;

  @Min(0)
  currentMileage: number;

  @IsHexColor()
  color: string;

  @ValidateNested()
  registration: RegistrationForm;

  constructor({
    licensePlate,
    vin,
    description,
    value,
    currentMileage,
    color,
    registration,
  }: {
    licensePlate: string;
    vin: string;
    description: string;
    value: string;
    currentMileage: number;
    color: string;
    registration: RegistrationForm;
  }) {
    this.licensePlate = licensePlate;
    this.vin = vin;
    this.description = description;
    this.value = value;
    this.currentMileage = currentMileage;
    this.color = color;
    this.registration = registration;
  }
}

export class CreateCarForm {
  @IsDefined()
  @IsNotEmpty()
  licensePlate: string;

  @IsDefined()
  @IsNotEmpty()
  vin: string;

  description: string;

  @IsDefined()
  @IsNotEmpty()
  value: string;

  @IsDefined()
  @IsNotEmpty()
  currentMileage: number;

  @IsDefined()
  @IsNotEmpty()
  color: string;

  @IsDefined()
  @IsNotEmptyObject()
  registration: RegistrationForm;
  constructor({
    licensePlate,
    vin,
    description,
    value,
    currentMileage,
    color,
    registration,
  }: {
    licensePlate: string;
    vin: string;
    description: string;
    value: string;
    currentMileage: number;
    color: string;
    registration: RegistrationForm;
  }) {
    this.licensePlate = licensePlate;
    this.vin = vin;
    this.description = description;
    this.value = value;
    this.color = color;
    this.currentMileage = currentMileage;
    this.registration = registration;
  }
}

export class GetCarsQuery {
  @IsAlphanumeric()
  id: string;

  @IsAlphanumeric()
  @Max(12)
  licensePlate: string;

  @IsAlphanumeric()
  @Min(11)
  @Max(17)
  vin: string;

  @IsHexColor()
  color: string;

  @IsDateString()
  createdDate: Date;
}
