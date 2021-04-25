import 'reflect-metadata';
import 'dotenv/config';

import 'express-async-errors';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import AppError from '@shared/errors/AppError';

import '@shared/container';
import '@shared/infra/typeorm';

import appRouter from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(appRouter);

app.use(
  (error: Error, _request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.log(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  },
);

export default app;
