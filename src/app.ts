import express from 'express';
import identifyRouter from './routes/identify';
import { validateData } from './middleware/validation';
import { identifySchema } from './schemas/identifySchema';

const app = express()

app.use(express.json());

app.use("/identify", validateData(identifySchema),  identifyRouter)

export default app;