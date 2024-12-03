import { Router, NextFunction } from "express";
import { db } from "../../../db";
import { startOfDay, endOfDay } from 'date-fns'; 

const router = Router();


router.post("/make_order", async (req: any, res: any, next: NextFunction) => {
    const { mealId, quantity, N_ID_DIRECCION } = req.body;

    try {
        const mealType = await db.fit_comida.findUnique({
            where: { N_ID_COMIDA: mealId },
            select: { X_TIPO_COMIDA: true },
        });

        // Verificar si ya existe un pedido del mismo tipo para el día actual
        const existingOrder = await db.fit_pedido.findFirst({
            where: {
                N_ID_USUARIO: req.user.userId,
                F_PEDIDO: {
                    gte: startOfDay(new Date()),
                    lt: endOfDay(new Date()),
                },
                fit_pedido_detalle: {
                    some: {
                        fit_comida: {
                            X_TIPO_COMIDA: mealType?.X_TIPO_COMIDA,
                        },
                    },
                },
            },
        });

        if (existingOrder) {
            return res.status(400).json({ message: "Ya has pedido un tipo de comida similar hoy." });
        }

        // Crear el pedido
        const newOrder = await db.fit_pedido.create({
            data: {
                N_ID_USUARIO: req.user.userId,
                F_PEDIDO: new Date(),
                N_ID_DIRECCION: N_ID_DIRECCION,
                X_ESTADO_PEDIDO: "Pendiente",
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
            where: { N_ID_USUARIO: req.user.userId },
            include: {
                fit_pedido_detalle: {
                    include: {
                        fit_comida: {
                            select: {
                                X_NOMBRE_COMIDA: true,
                                X_IMG: true,
                                N_CALORIAS: true,
                                X_DESCRIPCION: true,
                                X_TIPO_COMIDA: true,
                            }
                        }
                    }
                },
            },
            orderBy: { F_PEDIDO: "desc" }
        });

        // Agrupar pedidos por día
        const groupedOrders = orders.reduce((acc: any, order) => {
            const dateKey = formatDate(order.F_PEDIDO); // Formatear la fecha
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push({
                ...order,
                fit_pedido_detalle: order.fit_pedido_detalle.map(detalle => ({
                    nombreComida: detalle.fit_comida?.X_NOMBRE_COMIDA,
                    imagenComida: detalle.fit_comida?.X_IMG,
                    caloriasComida: detalle.fit_comida?.N_CALORIAS,
                    horario: detalle.fit_comida?.X_TIPO_COMIDA,
                }))
            });
            return acc;
        }, {});

        function formatDate(date: Date | null): string {
            if (!date) return "Fecha no disponible";
            const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
            return new Intl.DateTimeFormat("es-ES", options).format(date);
        }
          console.log(groupedOrders)  
        res.status(200).json({ message: "Pedidos encontrados", data: groupedOrders });
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        next(error);
    }
});

router.post("/filterpedido", async (req: any, res, next: NextFunction) => {
    const { filter_fecha } = req.body;

    try {
        const orders = await db.fit_pedido.findMany({
            where: { 
                N_ID_USUARIO: req.user.userId,
                F_PEDIDO: filter_fecha
            },
            include: {
                fit_pedido_detalle: true,
                fit_direccion: true,
            },
        });

        res.status(200).json({ message: "Pedidos encontrados", data: orders });
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        next(error);
    }
});

router.post('/ordersrout', async (req: any, res) => {
  try {
    const orders = await db.fit_pedido.findMany({
      where: { N_ID_USUARIO: req.user.userId },
      include: {
        fit_pedido_detalle: {
          include: {
            fit_comida: true, 
          },
        },
      },
      orderBy: {
        F_PEDIDO: 'desc', 
      },
    });

    const transformedOrders = orders.map((order) => ({
      id: order.N_ID_PEDIDO,
      status: order.X_ESTADO_PEDIDO,
      items: order.fit_pedido_detalle.map((item) => ({
        name: item.fit_comida?.X_NOMBRE_COMIDA,
        image: item.fit_comida?.X_IMG,
        // ... other details you need 
      })),
      // ... (add other relevant order data)
    }));

    res.json(transformedOrders); 
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    res.status(500).json({ error: "Error al obtener los pedidos" });
}
});

export default router;
