// src/_middleware/validateRequest.ts
import { Request, NextFunction } from 'express';
import Joi from 'joi';

export function validateRequest(
    req: Request, 
    next: NextFunction, 
    schema: Joi.ObjectSchema
): void {
    const options = {
        abotEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    };

    const {error, value } = schema.validate(req.body, options);

    if (error) {
        next(new Error(`Validation error: ${error.details.map((d) => d.message).join(', ')}`));
    } else {
        req.body = value;
        next();
    }
}