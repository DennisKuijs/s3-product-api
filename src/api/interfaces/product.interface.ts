import { Document } from "mongoose";

export default interface Product extends Document {
    productId: string,
    productCode: Number,
    productName: string,
    productDescription: string,
    eanCodes: Array<Number>,
    image: string,
    imageUrl: string,
    barCode: string,
    weight: Number,
    size: {
        length: Number,
        width: Number,
        height: Number,
    },
    stock: {
        totalStock: Number,
        reservedStock: Number,
        availableStock: Number
    },
    hsCode: string,
    countryOfOrigin: string,
    customsProductDescription: string,
    notes: string,
    prices: {
        purchasePrice: Number,
        salesPrice: Number,
        vatPercentage: Number,
    },
    productStatus: Boolean,
    createdAt: Date,
    updatedAt: Date
}