
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prisma.js';

const router = Router();

const submitSchema = z.object({
  primaryOptionId: z.string().uuid().nullable(),
  customText: z.string().max(120).optional(),
  synonyms: z.array(z.string()).optional()
});

router.get('/options', async (req, res) => {
  const q = String(req.query.query || '').toLowerCase();
  const items = await prisma.career_options.findMany({
    where: q ? { label: { contains: q, mode: 'insensitive' } } : {},
    take: 50,
    orderBy: { label: 'asc' }
  });
  res.json(items.map(i => ({ id: i.id, label: i.label })));
});

router.post('/', async (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  // TODO: replace with real user from auth
  const user = await prisma.users.findFirst();
  if (!user) return res.status(403).json({ error: 'No users seeded yet' });

  await prisma.student_profiles.upsert({
    where: { user_id: user.id },
    update: {
      career_interest_primary: parsed.data.primaryOptionId || undefined,
      career_interest_custom: parsed.data.customText || null
    },
    create: {
      user_id: user.id,
      major: 'Undeclared',
      career_interest_primary: parsed.data.primaryOptionId || undefined,
      career_interest_custom: parsed.data.customText || null
    }
  });
  res.json({ status: 'ok', profileUpdated: true });
});

export default router;
