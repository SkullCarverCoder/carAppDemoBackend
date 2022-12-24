import { Application } from "express";
import { createExpressServer } from "routing-controllers";

import * as Controllers from "../api/controllers";
import * as Middlewares from "../api/middlewares";

export function ExpressServerLoader(): Application {
  const expressApp: Application = createExpressServer({
    cors: true,
    classTransformer: true,
    defaultErrorHandler: false,
    middlewares: Object.values(Middlewares),
    controllers: Object.values(Controllers),
  });

  expressApp.listen(process.env.PORT);

  return expressApp;
}
