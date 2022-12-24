import {
  Body,
  Get,
  JsonController,
  Post,
  Delete,
  Param,
  QueryParams,
  Put,
} from "routing-controllers";
import { validate, ValidationError } from "class-validator";
import { GetCarsQuery, UpdateCarForm, CreateCarForm } from "../../forms/car";
import {
  ApiError,
  ModelNotFoundError,
  FormError,
  ApiClientError,
} from "../../../utils/errorResponse";
import * as _ from "lodash";
import { Car, Registration, VehicleMetadata } from "../../models";
import { API_PREFIX } from "../../";
import { UpdateResult } from "typeorm";

@JsonController(API_PREFIX + "cars")
export class CarsController {
  // all vehicles
  @Get("/all")
  get(): Promise<Car[]> {
    return Car.find({ active: true });
  }

  // unique vehicle
  @Get("/v/:id")
  getOne(@Param("id") id: string): Promise<Car | undefined> {
    return Car.findOne({ vin: id, active: true }, { relations: ["registration", "metadata"] }).then(
      (existingCar) => {
        if (!existingCar) {
          throw new ModelNotFoundError("Car");
        }
        return existingCar;
      },
    );
  }

  // multiparameter search
  @Get("/v/search")
  getCars(@QueryParams() query: GetCarsQuery): Promise<Car[]> {
    return Car.find({ active: true, ...query }).then((existingCars) => {
      if (existingCars.length > 0) {
        return existingCars;
      }
      throw new ModelNotFoundError("Car");
    });
  }

  @Put("/v/:id")
  async put(@Param("id") id: string, @Body() car: any): Promise<[UpdateResult, Registration]> {
    let form_errors: ValidationError[];
    let car_form: UpdateCarForm = new UpdateCarForm({ ...car });
    form_errors = await validate(car_form);
    if (form_errors.length > 0) {
      throw new FormError(form_errors);
    }
    let vin_already_taken = await Car.findOne({ vin: car.vin });
    if (vin_already_taken !== undefined) {
      throw new ApiClientError("VIN already taken");
    }
    car.registration.number = Number(car.registration.number);
    car.value = Number(car.value.replace(",", ""));
    let only_registration_data: Object = { ...car.registration };
    delete car.registration;
    let only_car_data: Object = { ...car };
    let car_to_update: Car;
    let registration_to_update: Registration;
    car_to_update = await Car.findOne(
      { vin: id, active: true },
      { relations: ["registration", "metadata"] },
    );
    if (car_to_update === undefined) {
      throw new ModelNotFoundError("Car");
    }
    registration_to_update = await Registration.findOne({ id: car_to_update.registration.id });
    if (registration_to_update === undefined)
      throw new ModelNotFoundError("Registration (related to Car)");
    Object.keys(only_car_data).forEach((key) => {
      _.set(car_to_update, key, only_car_data[key]);
    });
    Object.keys(only_registration_data).forEach((key) => {
      _.set(registration_to_update, key, only_registration_data[key]);
    });
    return Promise.all([
      Car.update({ vin: id }, car_to_update, { listeners: true }),
      registration_to_update.save(),
    ]);
  }

  // create a vehicle (car)
  @Post("/v/create")
  async createCar(@Body() newCar: any): Promise<Object> {
    let form_errors: ValidationError[];
    let new_car_form: CreateCarForm = new CreateCarForm({ ...newCar });
    form_errors = await validate(new_car_form);
    if (form_errors.length > 0) {
      throw new FormError(form_errors);
    }
    let only_registration_data: Object = { ...newCar.registration };
    delete newCar.registration;
    delete new_car_form.registration;
    let only_car_data: Object = { ...new_car_form };
    const existing: Car | undefined = await Car.findOne(Car.create(only_car_data));
    if (existing !== undefined) {
      throw new ApiError("POST", "createCar");
    }
    let createdCar: Car = await Car.create(only_car_data).save();
    let createdRegistration: Registration = await Registration.create(
      only_registration_data,
    ).save();
    createdCar.registration = createdRegistration;
    let vehicleMetaData = await createdRegistration.decodeVin(new_car_form.vin);
    let carMetadata = await VehicleMetadata.create(vehicleMetaData).save();
    createdCar.metadata = carMetadata;
    createdCar.save();
    return {
      status: "success",
    };
  }

  //Delete car
  @Delete("/v/delete/:id")
  async deleteCar(@Param("id") id: string): Promise<Object> {
    let found_car: Car | undefined;
    found_car = await Car.findOne({ vin: id, active: true });
    if (found_car === undefined) throw new ModelNotFoundError("Car");
    found_car.active = false;
    await found_car.save();
    await found_car.softRemove();
    return {
      status: "success",
    };
  }
}
