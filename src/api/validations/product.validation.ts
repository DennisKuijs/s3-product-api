import Joi from 'joi'

const createProductSchema = Joi.object({
    productName: Joi.string().required().max(50),
    productCode: Joi.number().required().min(0),
    productDescription: Joi.string().max(50).allow(null),
    eanCodes: Joi.array().items(Joi.number().required()),
    image: Joi.string().allow(null),
    barCode: Joi.string().alphanum().required().max(50).allow(null),
    weight: Joi.number().min(0).allow(null),
    size: {
        length: Joi.number().min(0).allow(null),
        width: Joi.number().min(0).allow(null),
        height: Joi.number().min(0).allow(null),
    },
    stock: {
        totalStock: Joi.number(),
        reservedStock: Joi.number(),
        availableStock: Joi.number(),
    },
    hsCode: Joi.string().alphanum().allow(null),
    countryOfOrigin: Joi.string().alphanum().allow(null),
    customsProductDescription: Joi.string().alphanum().max(25).allow(null),
    notes: Joi.string().alphanum().max(25).allow(null),
    prices: {
        purchasePrice: Joi.number().required().min(0),
        salesPrice: Joi.number().required().min(0),
        vatPercentage: Joi.number().required().min(0),
    },
});

export default createProductSchema;