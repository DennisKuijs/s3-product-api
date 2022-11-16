import App from "./app";
import ProductController from "./api/controllers/product.controller";
import 'dotenv/config';
import validateEnv from "./api/utils/validateEnv";

validateEnv();

const app = new App([new ProductController()], 5000)
app.listen();