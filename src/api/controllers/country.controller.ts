import { Router, Request, Response, NextFunction } from "express";
import Controller from "../interfaces/controller.interface";
import CountryService from "../services/country.service";


class CountryController implements Controller {
    public path = '/countries';
    public router = Router();
    private CountryService = new CountryService();

    constructor() {
        this.initalizeRoutes();
    }

    private initalizeRoutes() : void {
        this.router.get(`${this.path}`, async(req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
            try {
                const countries = await this.CountryService.getCountries();
                res.status(200).json({ countries: countries })
            }
            catch (error : any) {
                res.status(400).json({ error: error.message })
            }
        })
    }
}

export default CountryController