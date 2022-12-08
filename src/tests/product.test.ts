import App from '../app';
import ProductController from '../api/controllers/product.controller';
import validateEnv from '../api/utils/validateEnv';
import DBConnection from '../api/utils/DBConnection';
import request from 'supertest'
import 'dotenv/config';
import Product from '../api/interfaces/product.interface';
import { v4 as uuid } from 'uuid'

let connection : any = null;

const productDTO : any = {
    productCode: 152,
    productName: "Dit is een test",
    productDescription: "test",
    eanCodes: [
        74545464654654,
        78798789798789
    ],
    barCode: "74545464654654",
    weight: 5,
    size: {
        length: 50,
        width: 50,
        height: 50
    },
    stock: {
        totalStock: 5,
        reservedStock: 5,
        availableStock: 5
    },
    hsCode: "dnf49945",
    countryOfOrigin: "Nederland",
    customsProductDescription: "test",
    notes: "323232332",
    prices: {
        purchasePrice: 1,
        salesPrice: 2,
        vatPercentage: 21
    }
}

let product : Product;
let fakeProductId = uuid();

describe('Product API -> Product', () => {

    beforeAll(async() => {
        validateEnv();
        connection = new App([new ProductController()], 0).express.listen()
    })

    afterAll(async() => {
        DBConnection.disconnectDB();
        connection.close();
    })

    it('GET /products -> No products available', async() => {
        const response = await request(connection).get('/api/v1/products/')

        expect(response.statusCode).toBe(200);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
        expect(response.body).toEqual(expect.objectContaining({
            filters: expect.objectContaining({
                maxPage: 1,
                currentPage: 1,
                limit: 0
            }),
            products: expect.arrayContaining([])
        }))
    })
    
    it('POST /create-product -> Create new product', async() => {
        const response : any = await request(connection).post('/api/v1/products/create-product').send(productDTO)

        expect(response.statusCode).toBe(201);
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')

        product = response.body.product;

        expect(response.body.product).toEqual({...product})
    })

    it('POST /create-product -> Create the same product again', async() => {
        const response : any = await request(connection).post('/api/v1/products/create-product').send(productDTO)

        expect(response.statusCode).toBe(400)
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
        expect(response.body).toEqual({ error: expect.any(String) })
    })

    it('GET /get-product -> Get product with productId', async() => {
        const response : any = await request(connection).get(`/api/v1/products/get-product/${product.productId}`)

        expect(response.statusCode).toBe(200)
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
        expect(response.body.product).toEqual({...product})
    })

    it('GET /get-product -> Get product with productId that does not exists', async() => {
        const response : any = await request(connection).get(`/api/v1/products/get-product/${fakeProductId}`)

        expect(response.statusCode).toBe(400)
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
        expect(response.body).toEqual({ error: expect.any(String) })
    })

    it('PUT /update-product -> Update product with productId', async() => {
        productDTO.hsCode = "test1234"

        const response : any = await request(connection).put(`/api/v1/products/update-product/${product.productId}`).send(productDTO)
        
        expect(response.statusCode).toBe(200)
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
        
        product.hsCode = productDTO.hsCode;
        product.updatedAt = response.body.product.updatedAt

        expect(response.body.product).toEqual({...product})
    })

    it('PUT /update-product -> Update product with productId that does not exists', async() => {
        const response : any = await request(connection).put(`/api/v1/products/update-product/${fakeProductId}`).send(productDTO)

        expect(response.statusCode).toBe(400)
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
        expect(response.body).toEqual({ error: expect.any(String) })
    })

    it('PUT /disable-product -> Disable product with productId', async() => {
        const response : any = await request(connection).put(`/api/v1/products/disable-product/${product.productId}`)

        expect(response.statusCode).toBe(200)
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')

        product.productStatus = !product.productStatus
        product.updatedAt = response.body.product.updatedAt

        expect(response.body.product).toEqual({...product})
    })

    it('PUT /disable-product -> Disable product with productId that does not exists', async() => {
        const response : any = await request(connection).put(`/api/v1/products/disable-product/${fakeProductId}`)

        expect(response.statusCode).toBe(400)
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
        expect(response.body).toEqual({ error: expect.any(String) })
    })

    it ('DELETE /delete-product -> Delete product with productId', async() => {
        const response = await request(connection).delete(`/api/v1/products/delete-product/${product.productId}`)

        expect(response.statusCode).toBe(200)
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
        expect(response.body.product).toEqual({...product})
    })

    it ('DELETE /delete-product -> Delete product with productId that does not exists', async() => {
        const response : any = await request(connection).delete(`/api/v1/products/delete-product/${fakeProductId}`)

        expect(response.statusCode).toBe(400)
        expect(response.header['content-type']).toBe('application/json; charset=utf-8')
        expect(response.body).toEqual({ error: expect.any(String) })
    })
})
