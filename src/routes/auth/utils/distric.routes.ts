import { Router,Request, Response } from "express";
import { db } from "../../../db";

const router = Router();

router.get("/departamento" , async (req, res) => {
    try{
        const departamentos = await db.departamento.findMany();
        res.status(200).json({ departamentos });
    }catch(error){
        res.status(200).json({ message: "Error de departamentos" });
    }
});

router.get("/provincia/:departamentoId" , async (req, res) => {
    const { departamentoId } = req.params;
    try{
        const provincia = await db.provincia.findMany({
            where:  { departamentoId: parseInt(departamentoId) }
        });
        res.status(200).json({ provincia });
    }catch(error){
        res.status(200).json({ message: "Error de departamentos" });
    }    
});

router.get("/distrito/:provinciaId" , async (req, res) => {
    const { provinciaId } = req.params;
    try{
        const distrito = await db.distrito.findMany({
            where:  { provinciaId: parseInt(provinciaId) }
        });
        res.status(200).json({ distrito });
    }catch(error){
        res.status(200).json({ message: "Error de departamentos" });
    }   
});
export default router;