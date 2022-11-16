import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const validate = (schema: Joi.Schema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const value = await schema.validateAsync(req.body);
        req.body = value;
        next(); 
    }
    catch(error) {
        res.status(400).json({errors: error})
    }
}

export default validate;