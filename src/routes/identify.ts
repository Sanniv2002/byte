import { Router } from "express";
import type { Request, Response } from "express";

const identifyRouter = Router()

identifyRouter.post('/', (req: Request, res: Response) => {
    res.json({
        "message":  "Hello"
    })
})

export default identifyRouter;