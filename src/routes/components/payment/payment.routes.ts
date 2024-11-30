import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { config as dotenv } from 'dotenv';
import { db } from "../../../db";

dotenv(); 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-11-20.acacia',
});

const router = Router();

router.post('/create-payment-intent', async (req: any, res) => {
  const { amount, currency, planId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });

    await db.fit_pago.create({
      data: {
        N_ID_USUARIO: req.user.userId,
        N_ID_PLAN: planId,
        N_MONTO: amount / 100, 
        X_METODO_PAGO: 'card',
        X_ESTADO_PAGO: 'Pendiente', 
        F_PAGO: new Date(),
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/confirm-payment', async (req: any, res) => {
  const { paymentIntentId, planId } = req.body;

  try {
    // Obtener el estado del PaymentIntent desde Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Actualizar estado del pago en la base de datos
      await db.fit_pago.updateMany({
        where: { 
          N_ID_USUARIO: req.user.userId, 
          N_ID_PLAN: planId,
        },
        data: { X_ESTADO_PAGO: 'Completado' },
      });

      // Asignar el plan al usuario
      await db.fit_usuario.update({
        where: { N_ID_USUARIO: req.user.userId },
        data: { N_ID_PLAN: planId },
      });

      res.status(200).json({ message: 'Pago confirmado y plan asignado' });
    } else {
      res.status(400).json({ message: 'El pago no se completó' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/cancel-pending-payment', async (req: any, res) => {
  const { planId } = req.body;

  try {
    await db.fit_pago.deleteMany({
      where: {
        N_ID_USUARIO: req.user.userId,
        N_ID_PLAN: planId,
        X_ESTADO_PAGO: 'Pendiente',
      },
    });

    res.status(200).json({ message: 'Pago pendiente cancelado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
