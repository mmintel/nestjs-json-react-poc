import Joi from '@hapi/joi';

export const SchemaValidator = Joi;
export type Schema = Joi.Schema;
export type ValidationResult = Joi.ValidationResult;
export type ValidationError = Joi.ValidationError;