import {Schema, ValidationError } from "yup";
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'


type TProperty = 'body' | 'header' | 'params' | 'query';
type TGetSchema = <T>(schema: Schema<T>) => Schema<T>;
type TAllSchemas = Record<TProperty, Schema<any>>;

type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>; // partial diz que nem todos campos são obrigatorios

type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;


export const validation: TValidation = (getSchema) => async (req, res, next) => {

    const schemas = getSchema((schema) => schema)

    const errorsResult: Record<string, Record<string, string>> = {}

        Object.entries(schemas).forEach(([key, schema]) => {

            try {
                schema.validateSync(req[key as TProperty], {abortEarly: false})

            } catch (error) {
                const yupError = error as ValidationError
                const errors: Record<string, string> = {}

                yupError.inner.forEach(error => {
                    if(error.path === undefined) return;
                    errors[error.path] = error.message

                })

                errorsResult[key] = errors
            }

        })

    if(Object.entries(errorsResult).length === 0) {
        return next()
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({errors: errorsResult})
    }

}