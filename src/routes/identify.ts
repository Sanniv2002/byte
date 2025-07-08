import { Router } from "express";
import type { Request, Response } from "express";
import IdentifyService from "../services/identifyService";
import { validateData } from "../middleware/validation";
import { identifySchema } from "../schemas/identifySchema";

const identifyRouter = Router()

identifyRouter.post('/', validateData(identifySchema), async (req: Request, res: Response) => {
    const email = req.body.email || null
    const phoneNumber = req.body.phoneNumber || null

    const identifyService = new IdentifyService(email, phoneNumber)
    const resp = await identifyService.identify()
    res.send(resp)
})

export default identifyRouter;