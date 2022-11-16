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
                throw new Error('Product already exists in the system!');
            }

            if(productdto.image != null) {
                try {
                    const image = await this.ImageService.uploadImage(productdto.image)
                    productdto.image = image.Key;
                }
                catch (error) {
                    throw new Error('Something went wrong with uploading the image')
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
                throw new Error('Product is not available in the system!')
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
            const products = await this.product.find({}).limit(limit).skip((page - 1) * limit)

            for (const product of products) {
                if(product.image != null) {
                    product.imageUrl = await this.ImageService.getImage(product.image)
                }
            }

            return products;
        }
        catch (error : any) {
            throw new Error(error.message)
        }
    }

    public async updateProduct(productId: string, productdto: Product) : Promise<Product | null> {
        try {
            const productExists = await this.product.exists({productId: productId})
            
            if (!productExists) {
                throw new Error('Product is not available in the system!')
            }

            const product = await this.product.findOneAndUpdate({productId: productId}, productdto)
            return product;
        }
        catch (error : any) {
            throw new Error(error.message)
        }
    }

    public async deleteProduct(productId: string) : Promise<Product | null> {
        try {
            const productExists = await this.product.exists({productId: productId})

            if (!productExists) {
                throw new Error('Product is not available in the system!')
            }

            const product = await this.product.findOneAndDelete({productId: productId})

            if(product && product.image != null) {
                await this.ImageService.deleteImage(product.image);
            }

            return product;
        }
        catch (error : any) {
            throw new Error(error.message)
        }
    }
}

export default ProductService;