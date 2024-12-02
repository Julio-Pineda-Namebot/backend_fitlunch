import { Router,Request, Response } from "express";
import { db } from "../../db";

const router = Router();

router.post('/delete_user', async (req: any, res) => {
    try {

      await db.fit_pago.deleteMany({ 
        where: {
            N_ID_USUARIO: req.user.userId,
        },
      });

      await db.fit_usuario.delete({
        where: {
          N_ID_USUARIO: req.user.userId,
        },
      });
  
      res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
  
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

export default router;