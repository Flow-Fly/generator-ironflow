import "dotenv/config";
import { cowthink } from "cowsayjs";
import dbConnection from "./config/database.js";
import appConfig from "./config/app-config.js";
import handle404 from "./config/not-found.js";
import handleError from "./config/error-handling.js";
import indexRouting from "./routes/index.routes.js";
await dbConnection();

import express from "express";
const app = express();
appConfig(app);

app.use("/api", indexRouting);

app.use(handle404);
app.use(handleError);

const port = process.env.PORT ?? 8080;

app.listen(port, () => {
	console.log(
		cowthink(`
  Your server is running!
  http://localhost:${port}
  Mooo
  `)
	);
});
