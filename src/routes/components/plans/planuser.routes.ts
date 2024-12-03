import { Router,Request, Response } from "express";
import { db } from "../../../db";
const router = Router();

router.get("/active-plan", async (req: any, res) => { 
    try {
        const user = await db.fit_usuario.findUnique({
            where: { N_ID_USUARIO: req.user.userId },
            select: {
                fit_plan: {
                    select: {
                        N_ID_PLAN: true,
                    },
                },
            },
        });

        res.status(200).json({ planId: user?.fit_plan?.N_ID_PLAN });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

router.post('/cancel-plan', async (req: any, res) => {
    try {
        await db.fit_usuario.update({
            where: { N_ID_USUARIO: req.user.userId },
            data: { 
                N_ID_PLAN: null
            },
        });

        res.status(200).json({ message: "Plan cancelado. Será válido hasta el final del período actual." });
    } catch (error) {
        res.status(500).json({ message: "Error al cancelar el plan.", error });
    }
});

// router.get('/can-purchase-plan', async (req: any, res) => {
//     try {
//         const user = await db.fit_usuario.findUnique({
//             where: { N_ID_USUARIO: req.user.userId },
//         });

//         res.status(200).json({ canPurchase: true });
//     } catch (error) {
//         res.status(500).json({ message: "Error al verificar si puedes comprar un plan.", error });
//     }
// });


// router.post('/user/renew-plan', async (req: any, res) => {
//     const { planId } = req.body;
//     try {
//         await db.fit_usuario.update({
//             where: { N_ID_USUARIO: req.user.userId },
//             data: { 
//                 N_ID_PLAN: planId,
//                 F_FECHA_FIN_PLAN: null
//             },
//         });

//         res.status(200).json({ message: "Plan renovado con éxito." });
//     } catch (error) {
//         res.status(500).json({ message: "Error al renovar el plan.", error });
//     }
// });


router.get("/plan-details", async (req: any, res) => {
    try {
        const user = await db.fit_usuario.findUnique({
            where: { N_ID_USUARIO: req.user.userId },
            include: { fit_plan: true }, 
        });

        if (user && user.fit_plan && user.F_FECHA_FIN_PLAN) { // Verificar si hay plan y fecha de fin
            const plan = user.fit_plan;
            const timeRemaining = calculateTimeRemaining(user.F_FECHA_FIN_PLAN); 

            res.status(200).json({
                planTitle: plan.X_NOMBRE_PLAN,
                planImage: plan.X_IMAGE,
                planDescription: plan.X_DESCRIPCION,
                planDuration: plan.N_TIEMPO_DURACION,
                timeRemaining: timeRemaining,
            });
        } else {
            // O puedes usar:
            res.status(404).json({ message: "No active plan found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

function calculateTimeRemaining(planEndDate: Date): number { // Cambiar el tipo a Date
    const now = new Date();
    const timeDiff = planEndDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 

    return daysRemaining;
}

export default router;