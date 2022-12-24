import { HttpError } from "routing-controllers";
import { ValidationError } from "class-validator";

export class ModelNotFoundError extends HttpError {
  constructor(className: string) {
    super(404, `${className} not found!`);
  }
}

export class ApiError extends HttpError {
  constructor(requestMethod: string, operation: string) {
    super(
      500,
      `Error processing on ${requestMethod} method doing the following operation -> ${operation}`,
    );
  }
}

export class FormError extends HttpError {
  constructor(errors: ValidationError[]) {
    super(400, `Data badly structured given the following errors -> \n ${errors}`);
  }
}

export class ApiClientError extends HttpError {
  constructor(errorMessage: string) {
    super(400, `Data badly structured given the following error: \n ${errorMessage}`);
  }
}
