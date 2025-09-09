
import { Router } from 'express';
import { prisma } from '../services/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  const user = await prisma.users.findFirst();
  const profile = await prisma.student_profiles.findUnique({ where: { user_id: user!.id } });
  res.json({ user, profile });
});

export default router;
