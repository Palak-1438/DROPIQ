import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const customersRouter = Router();

customersRouter.get('/', async (req, res) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const pageSize = Math.min(parseInt((req.query.pageSize as string) || '20', 10), 100);
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.customer.findMany({ skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
    prisma.customer.count(),
  ]);

  res.json({ items, page, pageSize, total });
});

customersRouter.post('/', async (req, res) => {
  const { name, email, segment, mrr } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const customer = await prisma.customer.create({ data: { name, email, segment, mrr: mrr ?? 0 } });
  res.status(201).json(customer);
});
