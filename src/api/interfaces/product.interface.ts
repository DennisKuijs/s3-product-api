import { Document } from "mongoose";

export default interface Product extends Document {
    productId: string,
    productCode: number,
    productName: string,
    productDescription: string,
    eanCodes: Array<number>,
    image: string,
    imageUrl: string,
    barCode: string,
    weight: number,
    size: {
        length: number,
        width: number,
        height: number,
    },
    stock: {
        totalStock: number,
        reservedStock: number,
        availableStock: number
    },
    hsCode: string,
    countryOfOrigin: string,
    customsProductDescription: string,
    notes: string,
    prices: {
        purchasePrice: number,
        salesPrice: number,
        vatPercentage: number,
    },
    productStatus: Boolean,
    createdAt: Date,
    updatedAt: Date
}