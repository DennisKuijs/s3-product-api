import { Router, Request, Response, NextFunction } from "express";
import Controller from "../interfaces/controller.interface";
import ValidationMiddleware from '../middlewares/validation.middleware';
import ProductValidation from '../validations/product.validation';
import ProductService from "../services/product.service";
import Product from "../interfaces/product.interface";

class ProductController implements Controller {
    public path = '/products';
    public router = Router();
    private ProductService = new ProductService();

    constructor() {
        this.initalizeRoutes();
    }

    private initalizeRoutes() : void {
        this.router.post(`${this.path}/create-product`, ValidationMiddleware(ProductValidation), async (req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
            const productDTO : Product = req.body;
            try {
                const product = await this.ProductService.createProduct(productDTO)
                res.status(201).json({ message: 'Product succesvol toegevoegd', product: product })
            }
            catch (error : any) {
                res.status(400).json({ error: error.message })
            }
        })
        
        this.router.get(`${this.path}/get-product/:productId`, async (req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
            const productId : string = req.params.productId;
            try {
                const product = await this.ProductService.getProduct(productId)
                res.status(200).json({ product: product })
            }
            catch (error : any) {
                res.status(400).json({ error: error.message })
            }
        })

        this.router.get(`${this.path}`, async (req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
            const pageNumber : number = parseInt(req.query.pageNumber as string);
            const pageLimit : number = parseInt(req.query.pageLimit as string);

            try {
                const products = await this.ProductService.getAllProducts(pageLimit, pageNumber);
                res.status(200).json(products)
            }
            catch (error : any) {
                res.status(400).json({ error: error.message })
            }
        })

        this.router.put(`${this.path}/update-product/:productId`, async (req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
            const productId : string = req.params.productId;
            const productDTO : Product = req.body;

            try {
                const product = await this.ProductService.updateProduct(productId, productDTO);
                res.status(200).json({ product: product })
            }
            catch (error : any) {
                res.status(400).json({ error: error.message })
            }
        })
        this.router.put(`${this.path}/disable-product/:productId`, async(req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
            const productId : string = req.params.productId;

            try {
                const product = await this.ProductService.disableProduct(productId);
                res.status(200).json({ message: product?.productStatus != true ? 'Product succesvol uitgeschakeld' : 'Product succesvol ingeschakeld' , product: product })
            }
            catch (error : any) {
                res.status(400).json({ error: error.message })
            }
        })
        this.router.delete(`${this.path}/delete-product/:productId`, async (req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
            const productId : string = req.params.productId;

            try {
                const product = await this.ProductService.deleteProduct(productId)
                res.status(200).json({ message: 'Product succesvol verwijderd', product: product })
            }
            catch (error : any) {
                res.status(400).json({ error: error.message })
            }
        })
        
    }
}

export default ProductController