import {
  Max,
  Min,
  IsInt,
  IsAlpha,
  IsIn,
} from "class-validator";
import { US_STATES_ISO_2 } from "../../utils/states";

export class RegistrationForm {
  @IsInt()
  number: number;

  @IsAlpha()
  @Min(2)
  @Max(2)
  // this could change to include other country's state/provinces or match by country/state
  @IsIn(US_STATES_ISO_2)
  state: string;

  @IsAlpha()
  @Min(5)
  @Max(100)
  fullname: string;
}
