import { Router, NextFunction } from "express";
import { db } from "../../../db";

const router = Router();

router.get("/user-meals/:day", async (req: any, res, next: NextFunction) => {
    const { day } = req.params;

    try {
      // Validar que el día es válido
      const validDays = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
      if (!validDays.includes(day)) {
        res.status(400).json({ message: "Día inválido" });
      }

      // 1. Obtener el plan del usuario
      const user = await db.fit_usuario.findUnique({
        where: { N_ID_USUARIO: req.user.userId },
        select: { N_ID_PLAN: true },
      });

      // 2. Verificar si el usuario y el plan existen
      if (!user || !user.N_ID_PLAN) {
        res.status(404).json({ message: "Usuario o plan no encontrado" });
        return; 
      }

      // 3. Consultar las comidas del plan para el día
      const meals = await db.fit_plan_comida_dia.findMany({
        where: {
          N_ID_PLAN: user.N_ID_PLAN,
          X_DIA: day,
        },
        include: {
          fit_comida: true, // Incluye información de la comida asociada
        },
      });

      // Verificar si hay comidas para el día
      if (meals.length === 0) {
        res.status(404).json({ message: "No hay comidas asignadas para este día" });
      }

      // 4. Mapear la respuesta
      const response = meals.map((meal) => ({
        mealId: meal.fit_comida.N_ID_COMIDA,
        name: meal.fit_comida.X_NOMBRE_COMIDA,
        description: meal.fit_comida.X_DESCRIPCION,
        calories: meal.fit_comida.N_CALORIAS,
        image: meal.fit_comida.X_IMG,
        type: meal.fit_comida.X_TIPO_COMIDA,
      }));

      // 5. Enviar la respuesta
      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching user meals:", error);
      next(error); // Pasar el error al middleware de manejo de errores
    }
  }
);

export default router;
