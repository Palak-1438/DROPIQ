import { Router } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { notifyHighRisk } from '../index';

const prisma = new PrismaClient();
export const mlRouter = Router();

const ML_URL = process.env.ML_SERVICE_URL || 'http://ml-service:8000';

mlRouter.post('/predict', async (req, res) => {
  try {
    const { customerId, features } = req.body;
    if (!customerId || !features) return res.status(400).json({ error: 'customerId and features required' });

    const response = await axios.post(`${ML_URL}/predict`, { features });
    const { probability, label, shap_explanation } = response.data;

    const score = await prisma.churnScore.create({
      data: {
        customerId,
        probability,
        label,
        shapJson: JSON.stringify(shap_explanation ?? {}),
      },
    });

    if (probability >= 0.7) {
      await prisma.notification.create({
        data: {
          type: 'high_risk_customer',
          message: `Customer ${customerId} is high risk with probability ${probability.toFixed(2)}`,
        },
      });
      notifyHighRisk({ customerId, probability, label });
    }

    res.json({ score });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'prediction_failed' });
  }
});
