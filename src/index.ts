import dotenv from "dotenv";
import express from "express";
import path from "path";
import * as routes from "./routes";

dotenv.config();
const port = process.env.SERVER_PORT;

const app = express();

routes.register(app);

app.listen(port, () => {
  // tslint:disable-next-line: no-console
  console.log(`Listening to requests on http://localhost:${port}`);
});