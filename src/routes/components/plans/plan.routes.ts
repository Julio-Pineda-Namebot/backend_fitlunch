import { Router,Request, Response } from "express";
import { db } from "../../../db";
const router = Router();

router.get('/plans', async (req, res) => {
    try{
        const plans = await db.fit_plan.findMany({
            include: {
                fit_images: true, 
            },
        });
        res.status(200).json(plans);
    }catch(error){
        res.status(500).json({ message: "Error al obtener los planes", error });
    }
});

export default router;