import { Schema, model } from 'mongoose';
import Product from '../interfaces/product.interface';
import { v4 as uuid } from 'uuid'

const ProductSchema = new Schema({
    productId: {
        type: String,
        required: true,
        default: () => uuid(),
        immutable: true,
    },
    productCode: {
        type: Number,
        required: true,
        unique: true,
        min: 0,
    },
    productName: {
        type: String,
        required: true,
        max: 50,
    },
    productDescription: {
        type: String,
        required: false,
        max: 200,
    },
    eanCodes: {
        type: [Number],
        required: true,
    },
    image: {
        type: String,
        required: false,
        max: 200,
    },
    imageUrl: {
        type: String,
        required: false,
        max: 200,
    },
    barCode: {
        type: String,
        required: false
    },
    weight: {
        type: Number,
        required: false,
        min: 0
    },
    size: {
        length: {
            type: Number,
            required: false,
            min: 0
        },
        width: {
            type: Number,
            required: false,
            min: 0
        },
        height: {
            type: Number,
            required: false,
            min: 0
        }
    },
    stock: {
        totalStock: {
            type: Number,
            required: false,
            default: 0,
        },
        reservedStock: {
            type: Number,
            required: false,
            default: 0,
        },
        availableStock: {
            type: Number,
            required: false,
            default: 0,
        }
    },
    hsCode: {
        type: String,
        required: false,
    },
    countryOfOrigin: {
        type: String,
        required: false,
    },
    customsProductDescription: {
        type: String,
        required: false,
        max: 25,
    },
    notes: {
        type: String,
        required: false,
        max: 50
    },
    prices: {
        purchasePrice: {
            type: Number,
            required: true,
            min: 0
        },
        salesPrice: {
            type: Number,
            required: true,
            min: 0
        },
        vatPercentage: {
            type: Number,
            required: true,
            min: 0
        }
    },
    productStatus: {
        type: Boolean,
        required: true,
        default: true,
    }
}, {
    timestamps: true,
});

export default model<Product>('Product', ProductSchema);