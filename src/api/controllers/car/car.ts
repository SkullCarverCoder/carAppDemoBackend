import { Body, Get, JsonController, Post, Delete, Param, QueryParams, Put, OnUndefined } from "routing-controllers";
import { validate, ValidationError } from "class-validator";
import { GetCarsQuery, UpdateCarForm, CreateCarForm } from "src/api/forms/car";
import { ModelNotFoundError } from "src/utils/errorResponse";
import * as _ from "lodash";
import { Car, Registration} from "../../models";
import { API_PREFIX } from "src/api";

@JsonController(API_PREFIX + "cars")
export class CarsController {

  // all vehicles
  @Get("all")
  @OnUndefined(() => new ModelNotFoundError("Cars"))
  get(): Promise<Car[]> | undefined {
    return Car.find();
  }

  // unique vehicle
  @Get("v/:id")
  @OnUndefined(() => new ModelNotFoundError("Car"))
  getOne(@Param("id") id: string): Promise<Car> | undefined {
    return Car.findOne({id: id})
  }

  // multiparameter search
  @Get("v/search")
  @OnUndefined(() => new ModelNotFoundError("Car(s)"))
  getCars(@QueryParams() query: GetCarsQuery): Promise<Car[] | undefined>{
    return Car.find({...query})
  }

  @Put("v/:id")
  @OnUndefined(() => new ModelNotFoundError("Car"))
  put(@Param('id') id: string, @Body() car: any ): Promise<[Car, Registration]> | ValidationError[] | undefined{
    let form_errors: ValidationError[] | null = null;
    let car_form: UpdateCarForm = new UpdateCarForm({...car})
    validate(car_form).then(errors => {
      if(errors.length > 0){
        form_errors = errors
      }
    })
    if (form_errors === null){
      let only_registration_data: Object = {...car.registration}
      delete car.registration
      let only_car_data: Object = {...car}
      let car_to_update: Car| undefined = undefined
      let registration_to_update: Registration | undefined
      Car.findOne({id:id}, { relations: ["registration"]}).then((carFound) => car_to_update = carFound)
      if(car_to_update === undefined){
        return undefined
      }else{
        Registration.findOne({id:car_to_update.registration.id}).then((registrationFound) => registration_to_update = registrationFound)
      }
      Object.keys(only_car_data).forEach((key) => {
        _.set(car_to_update, key, only_car_data[key])
      })
      Object.keys(only_registration_data).forEach((key) => {
        _.set(registration_to_update, key, only_car_data[key])
      })
      return Promise.all([car_to_update.save(), registration_to_update.save()])
    }else {
      return form_errors
    }
  }
  // create a vehicle (car)
  // @Post("v/create")
  // createCar(@Body() car: CreateCarForm)
}
