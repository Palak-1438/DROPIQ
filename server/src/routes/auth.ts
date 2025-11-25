import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const authRouter = Router();

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

function signTokens(userId: number, role: string) {
  const accessToken = jwt.sign({ sub: userId, role }, process.env.JWT_ACCESS_SECRET || 'access', { expiresIn: ACCESS_TTL });
  const refreshToken = jwt.sign({ sub: userId, role }, process.env.JWT_REFRESH_SECRET || 'refresh', { expiresIn: REFRESH_TTL });
  return { accessToken, refreshToken };
}

authRouter.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'user exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, role: 'admin' } });
  const tokens = signTokens(user.id, user.role);
  res.json({ user: { id: user.id, email: user.email, role: user.role }, ...tokens });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const tokens = signTokens(user.id, user.role);
  res.json({ user: { id: user.id, email: user.email, role: user.role }, ...tokens });
});
