import { Router } from "express";
import type { Request, Response } from "express";

const identifyRouter = Router()

identifyRouter.post('/', (req: Request, res: Response) => {
    const email = req.body.email || null
    const phoneNumber = req.body.phoneNumber || null

    console.log(email, phoneNumber)
    res.send("Hi")
})

export default identifyRouter;