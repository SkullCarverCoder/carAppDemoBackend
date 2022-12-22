import { HttpError } from 'routing-controllers';

export class ModelNotFoundError extends HttpError {
  constructor(className: string) {
    super(404, `${className} not found!`);
  }
}
