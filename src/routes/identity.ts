import { Router } from "express";
import type { Request, Response } from "express";

const identityRouter = Router()

identityRouter.post('/', (req: Request, res: Response) => {
    res.json({
        "message":  "Hello"
    })
})

export default identityRouter;