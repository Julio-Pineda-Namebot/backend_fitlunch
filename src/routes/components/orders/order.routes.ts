import { Router, NextFunction } from "express";
import { db } from "../../../db";

const router = Router();

router.post("/make_order", async (req: any, res, next: NextFunction) => {
    const { mealId, quantity, N_ID_DIRECCION } = req.body;

    try {
        // Crear el pedido
        const newOrder = await db.fit_pedido.create({
            data: {
                N_ID_USUARIO: req.user.userId,
                F_PEDIDO: new Date(),
                N_ID_DIRECCION: N_ID_DIRECCION,
                X_ESTADO_PEDIDO: "Completado",
                fit_pedido_detalle: {
                    create: {
                        N_ID_COMIDA: mealId,
                        N_CANTIDAD: quantity,
                    },
                },
            },
            include: {
                fit_pedido_detalle: true,
            },
        });

        res.status(200).json({ message: "Pedido guardado con éxito", data: newOrder });
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        next(error);
    }
});

router.get("/myorders", async (req: any, res, next: NextFunction) => {
    try {
        const orders = await db.fit_pedido.findMany({
            where: { N_ID_USUARIO: req.user.userId},
            include: {
                fit_pedido_detalle: true,
                fit_direccion: true,
            },
            orderBy: {
                F_PEDIDO: "desc",
            },
        });

        res.status(200).json({ message: "Pedidos encontrados", data: orders });
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        next(error);
    }
});

export default router;
