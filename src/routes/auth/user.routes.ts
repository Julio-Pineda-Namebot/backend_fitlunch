import { Router,Request, Response } from "express";
import { db } from "../../db";
import bcrypt from "bcryptjs";
import { 
generateVerificationCode, 
sendVerificationEmail, 
deleteUnverifiedUsers 
} 
from "./utils/authUtils";
const cron = require('node-cron');


// Programar la función para que se ejecute cada 10 segundos
cron.schedule('*/10 * * * * *', deleteUnverifiedUsers);
const router = Router();

router.post("/login" , async (req, res) => {
    const { X_EMAIL, X_CONTRASENA } = req.body;
    try {
        const user = await db.fit_usuario.findUnique({
        where: {
            X_EMAIL,
            estado_verificacion: 1,
        },
        select: {
            X_EMAIL: true,
            X_NOMBRE: true,
            X_APELLIDO: true,
            X_TELEFONO: true,
            X_CONTRASENA: true,
            X_FECHA_NAC: true,
            X_SEXO: true,
        }
        });

        if (user && await bcrypt.compare(X_CONTRASENA, user.X_CONTRASENA)) {
            const { X_CONTRASENA, ...userData } = user;
            res.status(200).json({
                name: user.X_NOMBRE,
                apellido: user.X_APELLIDO,
                email: user.X_EMAIL,
                telefono: user.X_TELEFONO, 
                fecha_nac: user.X_FECHA_NAC,
                sexo: user.X_SEXO,
            });
        } else {
            res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

router.post('/register', async (req, res) => {
    const { X_NOMBRE, X_APELLIDO, X_CONTRASENA, X_EMAIL, X_TELEFONO, X_CODIGO_VERIFICACION } = req.body;

    const verificationCode = generateVerificationCode();
    const hashedPassword = await bcrypt.hash(X_CONTRASENA,10);

    try {
        const user = await db.fit_usuario.create({
            data:{
                X_NOMBRE,
                X_APELLIDO,
                X_CONTRASENA: hashedPassword,
                X_EMAIL,
                X_TELEFONO,
                X_CODIGO_VERIFICACION: verificationCode,
                F_REGISTRO: new Date(),
                estado_verificacion: 0,
            
        }});
        await sendVerificationEmail(X_EMAIL, verificationCode, X_NOMBRE, 'registro');
        res.status(200).json({
            name: user.X_NOMBRE,
            apellido: user.X_APELLIDO,
            email: user.X_EMAIL,
            telefono: user.X_TELEFONO,
            fecha_nac: user.X_FECHA_NAC,
            sexo: user.X_SEXO,
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: "Error al registrar el usuario" });
    }
});

router.post('/verify_code', async (req, res) => {
    const { X_EMAIL, X_CODIGO_VERIFICACION } = req.body;

    try {
        const user = await db.fit_usuario.findUnique({
            where: { X_EMAIL },
        });

        if (user && user.X_CODIGO_VERIFICACION === X_CODIGO_VERIFICACION) {
            await db.fit_usuario.update({
                where: { X_EMAIL },
                data: { estado_verificacion: 1 },
            }); 
            res.json({ message: 'Código verificado correctamente' });
        } else {
            res.status(400).json({ message: 'Código de verificación incorrecto' });
        }
    } catch (error) {
        console.error('Error en la verificación del código:', error);
        res.status(500).json({ message: 'Error en la verificación del código' });
    }
});

router.post('/resend_code', async (req, res) => {
    const { X_EMAIL } = req.body;

    try {
        const user = await db.fit_usuario.findUnique({
            where: { X_EMAIL },
            select: {
                X_NOMBRE: true,
            }
        });

        const newVerificationCode = generateVerificationCode();

        await db.fit_usuario.update({
            where: { X_EMAIL },
            data: { X_CODIGO_VERIFICACION: newVerificationCode },
        });

        await sendVerificationEmail(X_EMAIL, newVerificationCode, user?.X_NOMBRE ?? '', 'registro');
        res.json({ message: 'Código reenviado exitosamente' });

    } catch (error) {
        console.error('Error al reenviar código:', error);
        res.status(500).json({ message: 'Error al reenviar código de verificación' });
    }
});


router.post('/confirm_password', async (req, res) => {
    const { X_EMAIL } = req.body;
    try{
        const user = await db.fit_usuario.findUnique({
            where: { X_EMAIL },
            select: {
                X_NOMBRE: true,
            }
        });
        
        const newVerificationCode = generateVerificationCode();

        await db.fit_usuario.update({
            where: { X_EMAIL },
            data: { X_CODIGO_VERIFICACION: newVerificationCode },
        });

        await sendVerificationEmail(X_EMAIL, newVerificationCode, user?.X_NOMBRE ?? "", 'recuperacion');
        res.json({ message: 'Código reenviado exitosamente' });
    }catch(error){
        console.error('Error al reenviar código:', error);
        res.status(500).json({ message: 'Error, no existe el usuario' });
    }
});

router.post('/new_password', async (req, res) => {
    const {X_EMAIL, X_NOMBRE, X_CODIGO_VERIFICACION, X_CONTRASENA} = req.body;
    const hashedPassword = await bcrypt.hash(X_CONTRASENA,10);
    try{
        const user = await db.fit_usuario.findUnique({
            where: { X_EMAIL },
        });

        await db.fit_usuario.update({
            where: { X_EMAIL },
            data: { X_CONTRASENA: hashedPassword}
        });
        res.json({ message: 'Contraseña actualizada correctamente' });
    }catch(error){
        res.status(500).json({ message: 'Error al ingresa contraseñas' });
    }
});

export default router;
