import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import router from "./src/router/routers.js";
const app = express();
const port = 250;
const host = "localhost";
const __dirname = dirname(fileURLToPath(import.meta.url));

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("html", ejs.renderFile);

//CONFIG FOLDER STATIC
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
app.use(router);

//SERVER INIT
app.listen(port, host, () => {
  console.log("server running");
  console.log(`url server : http://${host}:${port}/ `);
});
