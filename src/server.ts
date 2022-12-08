import App from "./app";
import ProductController from "./api/controllers/product.controller";
import CountryController from "./api/controllers/country.controller";
import Controller from "./api/interfaces/controller.interface";
import validateEnv from "./api/utils/validateEnv";
import 'dotenv/config';

validateEnv();

const controllers : Controller[] = [
    new ProductController(),
    new CountryController(),
]

const app = new App(controllers, 5000)
app.listen();