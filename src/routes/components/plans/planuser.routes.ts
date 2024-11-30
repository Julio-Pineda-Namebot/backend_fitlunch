import { Router,Request, Response } from "express";
import { db } from "../../../db";
const router = Router();

router.get('/active-plan', async (req: any, res) => {
    try {
        const user = await db.fit_usuario.findUnique({
            where: { N_ID_USUARIO: req.user.userId },
            include: { fit_plan: true },
        });

        res.status(200).json({ activePlan: user?.fit_plan });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el plan activo.", error });
    }
});

router.post('/cancel-plan', async (req: any, res) => {
    try {
        await db.fit_usuario.update({
            where: { N_ID_USUARIO: req.user.userId },
            data: { 
                F_FECHA_FIN_PLAN: new Date()
            },
        });

        res.status(200).json({ message: "Plan cancelado. Será válido hasta el final del período actual." });
    } catch (error) {
        res.status(500).json({ message: "Error al cancelar el plan.", error });
    }
});

router.get('/can-purchase-plan', async (req: any, res) => {
    try {
        const user = await db.fit_usuario.findUnique({
            where: { N_ID_USUARIO: req.user.userId },
        });

        res.status(200).json({ canPurchase: true });
    } catch (error) {
        res.status(500).json({ message: "Error al verificar si puedes comprar un plan.", error });
    }
});


router.post('/user/renew-plan', async (req: any, res) => {
    const { planId } = req.body;
    try {
        await db.fit_usuario.update({
            where: { N_ID_USUARIO: req.user.userId },
            data: { 
                N_ID_PLAN: planId,
                F_FECHA_FIN_PLAN: null
            },
        });

        res.status(200).json({ message: "Plan renovado con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al renovar el plan.", error });
    }
});

export default router;