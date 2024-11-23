import { Router,Request, Response } from "express";
import { db } from "../../../db";

const router = Router();

router.get("/departamento" , async (req, res) => {
    try{
        const departamentos = await db.departamento.findMany();
        res.status(200).json(departamentos);
    }catch(error){
        res.status(500).json({ message: "Error al obtener departamentos", error });
    }
});

router.get("/provincia/:departamentoId" , async (req, res) => {
    const { departamentoId } = req.params;
    try{
        const provincias = await db.provincia.findMany({
            where:  { departamentoId: parseInt(departamentoId) }
        });
        res.status(200).json(provincias);
    }catch(error){
        res.status(500).json({ message: "Error al obtener provincias", error });
    }    
});

router.get("/distrito/:provinciaId" , async (req, res) => {
    const { provinciaId } = req.params;
    try{
        const distritos = await db.distrito.findMany({
            where: { provinciaId: parseInt(provinciaId) },
        });
        res.status(200).json(distritos);
    }catch(error){
        res.status(500).json({ message: "Error al obtener distritos", error });
    }   
});
export default router;