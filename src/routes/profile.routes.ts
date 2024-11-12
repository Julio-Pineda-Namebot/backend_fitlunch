import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

router.post('/update_profile', async (req, res) => {
    const { X_EMAIL, X_NOMBRE, X_APELLIDO, X_TELEFONO, X_SEXO, X_FECHA_NAC } = req.body;
    
    try {
        const user = await db.fit_usuario.findUnique({
            where: { X_EMAIL: X_EMAIL },
        });

        await db.fit_usuario.update({
            where: { X_EMAIL: X_EMAIL },
            data: {
                X_NOMBRE: X_NOMBRE,
                X_APELLIDO: X_APELLIDO,
                X_SEXO: X_SEXO,
                X_FECHA_NAC: new Date(X_FECHA_NAC), 
            }
        });

        res.status(200).json({ message: 'Perfil actualizado correctamente' });

    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
});

export default router;
