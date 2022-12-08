import ProductModel from "../models/product.model";
import Product from "../interfaces/product.interface";
import ImageService from '../services/image.service';

class ProductService {
    private product = ProductModel;
    private ImageService = new ImageService();

    public async createProduct(productdto: Product) : Promise<Product> {
        try {
            const productExists = await this.product.exists({productCode: productdto.productCode})
            
            if (productExists) {
                throw new Error('Product bestaat al in het systeem!');
            }

            if(productdto.image != null) {
                try {
                    const image = await this.ImageService.uploadImage(productdto.image)
                    productdto.image = image.Key;
                }
                catch (error : any) {
                    throw new Error(error.message)
                }
            }

            const product = await this.product.create(productdto)
            return product;
        }
        catch (error : any) {
            throw new Error(error.message);
        }
    }

    public async getProduct(productId: string) : Promise<Product | null> {
        try {
            const productExists = await this.product.exists({productId: productId})
            
            if (!productExists) {
                throw new Error('Product is niet beschikbaar in het systeem')
            }

            const product = await this.product.findOne({productId: productId})
            return product;
        }
        catch (error : any) {
            throw new Error(error.message)
        }
    }

    public async getAllProducts(limit: number, page: number) : Promise<Product[]> {
        try {

            const newLimit = limit || 0
            const newPage = page || 1
            const startIndex = (page - 1) * limit
            let maxPage = 1;
            
            if (newLimit > 0) {
                maxPage = Math.ceil(await ProductModel.countDocuments() / newLimit) 
            }

            const results : any = {
                filters: {}
            }

            const products = await this.product.find({}).limit(newLimit).skip(startIndex)

            for (const product of products) {
                if(product.image != null) {
                    try {
                        product.imageUrl = await this.ImageService.getImage(product.image)
                    }
                    catch (error : any) {
                        throw new Error(error.message)
                    }
                }
            }

            results.filters.maxPage = maxPage;
            results.filters.currentPage = newPage;
            results.filters.limit = newLimit;
            results.products = products

            return results;
        }
        catch (error : any) {
            throw new Error(error.message)
        }
    }

    public async updateProduct(productId: string, productdto: Product) : Promise<Product | null> {
        try {
            const productExists = await this.product.exists({productId: productId})
            
            if (!productExists) {
                throw new Error('Product is niet beschikbaar in het systeem!')
            }

            const product = await this.product.findOneAndUpdate({productId: productId}, productdto, {
                new: true
            })
            return product;
        }
        catch (error : any) {
            throw new Error(error.message)
        }
    }

    public async disableProduct(productId: string) : Promise<Product | null> {
        try {
            const productExists = await this.product.exists({productId: productId})

            if (!productExists) {
                throw new Error('Product is niet beschikbaar in het systeem')
            }

            const product = await this.product.findOne({productId: productId})

            if(!product) {
                throw new Error('Product heeft geen gegevens!')
            }

            const disableProduct = await this.product.findOneAndUpdate({productId: productId}, {productStatus: !product.productStatus}, {
                new: true
            })

            return disableProduct
        }
        catch (error : any) {
            throw new Error(error.message)
        }
    }

    public async deleteProduct(productId: string) : Promise<Product | null> {
        try {
            const productExists = await this.product.exists({productId: productId})

            if (!productExists) {
                throw new Error('Product is niet beschikbaar in het systeem')
            }

            const product = await this.product.findOneAndDelete({productId: productId})

            if(product && product.image != null) {
                try {
                    await this.ImageService.deleteImage(product.image);
                }
                catch (error : any) {
                    throw new Error(error.message)
                }
            }

            return product;
        }
        catch (error : any) {
            throw new Error(error.message)
        }
    }
}

export default ProductService;