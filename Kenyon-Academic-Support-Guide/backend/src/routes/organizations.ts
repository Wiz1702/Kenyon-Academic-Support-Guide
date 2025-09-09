
import { Router } from 'express';
import { prisma } from '../services/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  const careerId = String(req.query.careerId || '');
  const mapped = await prisma.interest_org_map.findMany({
    where: careerId ? { career_option_id: careerId } : {},
    take: 50,
    include: { organizations: true }
  });
  const items = mapped.map((m:any) => ({
    id: m.organizations.id,
    name: m.organizations.name,
    category: m.organizations.category,
    description: m.organizations.description,
    contactEmail: m.organizations.contact_email,
    relevance: Number(m.relevance_score) || 0.6,
    confidence: 0.6,
    explanationId: null
  }));
  res.json({ items });
});

export default router;
