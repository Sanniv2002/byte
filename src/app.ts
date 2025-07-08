import express from 'express';
import identityRouter from './routes/identity'

const app = express()

app.use(express.json());

app.use("/identify", identityRouter)

export default app;